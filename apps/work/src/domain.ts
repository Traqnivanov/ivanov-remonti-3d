export type SurfaceKind = "wall" | "floor" | "ceiling";
export type WallId =
  | "room-1.wall-front"
  | "room-1.wall-back"
  | "room-1.wall-left"
  | "room-1.wall-right";

export type SurfaceId = WallId | "room-1.floor" | "room-1.ceiling";

export type Surface = {
  id: SurfaceId;
  kind: SurfaceKind;
  label: string;
};

export type Opening = {
  id: string;
  kind: "door" | "window";
  hostSurfaceId: WallId;
  widthM: number;
  heightM: number;
  offsetM: number;
  sillM?: number;
};

export type Room = {
  id: "room-1";
  name: string;
  widthM: number;
  lengthM: number;
  heightM: number;
  surfaces: Surface[];
  openings: Opening[];
};

export type ClientInfo = {
  what: string;
  why: string;
  result: string;
  includes: string;
};

export type ServicePresentationMode =
  | "highlight"
  | "material"
  | "geometry"
  | "xray"
  | "object";

export type ServiceAssignment = {
  id: string;
  serviceCode: string;
  label: string;
  targetEntityIds: SurfaceId[];
  included: boolean;
  quantityRuleId: string;
  priceBookItemId?: string;
  presentationMode: ServicePresentationMode;
  clientInfo?: ClientInfo;
};

export type FinePuttyServiceAssignment = ServiceAssignment & {
  id: "assignment-fine-putty-1";
  serviceCode: "fine-putty";
  label: "Фина шпакловка";
  targetEntityIds: WallId[];
  quantityRuleId: "wall-net-area-openings-v1";
  priceBookItemId: "dev-fine-putty";
  presentationMode: "highlight";
  clientInfo: ClientInfo;
};

export type LaminateFlooringServiceAssignment = ServiceAssignment & {
  id: "assignment-laminate-flooring-1";
  serviceCode: "laminate-flooring";
  label: "Ламинат";
  targetEntityIds: "room-1.floor"[];
  quantityRuleId: "floor-area-v1";
  priceBookItemId: "dev-laminate-flooring";
  presentationMode: "material";
  clientInfo: ClientInfo;
};

export type ProjectState = {
  schemaVersion: 1;
  projectId: string;
  room: Room;
  serviceAssignments: ServiceAssignment[];
};

export const wallIds: WallId[] = [
  "room-1.wall-front",
  "room-1.wall-back",
  "room-1.wall-left",
  "room-1.wall-right",
];

export const surfaceIds: SurfaceId[] = [
  ...wallIds,
  "room-1.floor",
  "room-1.ceiling",
];

export function isWallId(id: SurfaceId): id is WallId {
  return wallIds.includes(id as WallId);
}

export function getFinePuttyAssignment(
  project: ProjectState,
): FinePuttyServiceAssignment {
  const assignment = project.serviceAssignments.find(
    (item) => item.id === "assignment-fine-putty-1",
  );

  if (
    !assignment ||
    assignment.serviceCode !== "fine-putty" ||
    assignment.label !== "Фина шпакловка" ||
    assignment.quantityRuleId !== "wall-net-area-openings-v1" ||
    assignment.priceBookItemId !== "dev-fine-putty" ||
    assignment.presentationMode !== "highlight" ||
    !assignment.clientInfo ||
    assignment.targetEntityIds.some((id) => !isWallId(id))
  ) {
    throw new Error("Project is missing the canonical Fine Putty assignment.");
  }

  return assignment as FinePuttyServiceAssignment;
}

export function createLaminateFlooringAssignment(): LaminateFlooringServiceAssignment {
  return {
    id: "assignment-laminate-flooring-1",
    serviceCode: "laminate-flooring",
    label: "Ламинат",
    targetEntityIds: ["room-1.floor"],
    included: true,
    quantityRuleId: "floor-area-v1",
    priceBookItemId: "dev-laminate-flooring",
    presentationMode: "material",
    clientInfo: {
      what: "Ламинирана подова настилка за пода на помещението.",
      why: "За да се покаже и остойности конкретният подов финиш в Smart Offer.",
      result: "Завършен под с ламиниран финиш в крайния резултат.",
      includes: "Количеството се изчислява от площта на пода. DEV позицията не е production цена.",
    },
  };
}

export function findLaminateFlooringAssignment(
  project: ProjectState,
): LaminateFlooringServiceAssignment | undefined {
  const assignment = project.serviceAssignments.find(
    (item) => item.id === "assignment-laminate-flooring-1",
  );

  if (!assignment) return undefined;

  if (
    assignment.serviceCode !== "laminate-flooring" ||
    assignment.label !== "Ламинат" ||
    assignment.quantityRuleId !== "floor-area-v1" ||
    assignment.priceBookItemId !== "dev-laminate-flooring" ||
    assignment.presentationMode !== "material" ||
    !assignment.clientInfo ||
    assignment.targetEntityIds.length !== 1 ||
    assignment.targetEntityIds[0] !== "room-1.floor"
  ) {
    throw new Error("Project has an invalid canonical Laminate assignment.");
  }

  return assignment as LaminateFlooringServiceAssignment;
}

export function getLaminateFlooringAssignment(
  project: ProjectState,
): LaminateFlooringServiceAssignment {
  const assignment = findLaminateFlooringAssignment(project);
  if (!assignment) {
    throw new Error("Project is missing the canonical Laminate assignment.");
  }
  return assignment;
}

export function createOpeningProofProject(
  projectId = "prototype-room-1",
): ProjectState {
  const project = createDefaultProject(projectId);
  project.room.openings = [
    {
      id: "room-1.door-1",
      kind: "door",
      hostSurfaceId: "room-1.wall-front",
      widthM: 0.9,
      heightM: 2.1,
      offsetM: 0.55,
    },
    {
      id: "room-1.window-1",
      kind: "window",
      hostSurfaceId: "room-1.wall-right",
      widthM: 1.2,
      heightM: 1.1,
      offsetM: 1.4,
      sillM: 0.9,
    },
  ];
  return project;
}

export function createDefaultProject(projectId = "prototype-room-1"): ProjectState {
  return {
    schemaVersion: 1,
    projectId,
    room: {
      id: "room-1",
      name: "Дневна — прототип",
      widthM: 4.2,
      lengthM: 4.8,
      heightM: 2.6,
      surfaces: [
        { id: "room-1.wall-front", kind: "wall", label: "Предна стена" },
        { id: "room-1.wall-back", kind: "wall", label: "Задна стена" },
        { id: "room-1.wall-left", kind: "wall", label: "Лява стена" },
        { id: "room-1.wall-right", kind: "wall", label: "Дясна стена" },
        { id: "room-1.floor", kind: "floor", label: "Под" },
        { id: "room-1.ceiling", kind: "ceiling", label: "Таван" },
      ],
      openings: [],
    },
    serviceAssignments: [
      {
        id: "assignment-fine-putty-1",
        serviceCode: "fine-putty",
        label: "Фина шпакловка",
        targetEntityIds: [
          "room-1.wall-front",
          "room-1.wall-back",
          "room-1.wall-left",
          "room-1.wall-right",
        ],
        included: true,
        quantityRuleId: "wall-net-area-openings-v1",
        priceBookItemId: "dev-fine-putty",
        presentationMode: "highlight",
        clientInfo: {
          what: "Фина шпакловка за финално изравняване и заглаждане на включените стени.",
          why: "За да се получи гладка и равномерна основа преди грундиране и боядисване.",
          result: "Гладки стени, подготвени за следващите довършителни слоеве.",
          includes: "Количеството и стойността се отнасят само за стените, включени в тази позиция.",
        },
      },
      createLaminateFlooringAssignment(),
    ],
  };
}
