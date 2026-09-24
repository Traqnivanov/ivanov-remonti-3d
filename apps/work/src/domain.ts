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

export type Room = {
  id: "room-1";
  name: string;
  widthM: number;
  lengthM: number;
  heightM: number;
  surfaces: Surface[];
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
  quantityRuleId: "wall-area-v1";
  priceBookItemId: "dev-fine-putty";
  presentationMode: "highlight";
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
    assignment.quantityRuleId !== "wall-area-v1" ||
    assignment.priceBookItemId !== "dev-fine-putty" ||
    assignment.presentationMode !== "highlight" ||
    !assignment.clientInfo ||
    assignment.targetEntityIds.some((id) => !isWallId(id))
  ) {
    throw new Error("Project is missing the canonical Fine Putty assignment.");
  }

  return assignment as FinePuttyServiceAssignment;
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
        quantityRuleId: "wall-area-v1",
        priceBookItemId: "dev-fine-putty",
        presentationMode: "highlight",
        clientInfo: {
          what: "Фина шпакловка за финално изравняване и заглаждане на включените стени.",
          why: "За да се получи гладка и равномерна основа преди грундиране и боядисване.",
          result: "Гладки стени, подготвени за следващите довършителни слоеве.",
          includes: "Количеството и стойността се отнасят само за стените, включени в тази позиция.",
        },
      },
    ],
  };
}
