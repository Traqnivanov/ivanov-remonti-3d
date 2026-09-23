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

export type ServiceAssignment = {
  id: "assignment-fine-putty-1";
  serviceCode: "fine-putty";
  label: "Фина шпакловка";
  targetEntityIds: WallId[];
  included: boolean;
  quantityRuleId: "wall-area-v1";
  priceBookItemId: "dev-fine-putty";
  presentationMode: "highlight";
  clientInfo: {
    what: string;
    why: string;
    result: string;
    includes: string;
  };
};

export type ProjectState = {
  schemaVersion: 1;
  projectId: string;
  room: Room;
  serviceAssignment: ServiceAssignment;
};

export const wallIds: WallId[] = [
  "room-1.wall-front",
  "room-1.wall-back",
  "room-1.wall-left",
  "room-1.wall-right",
];

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
    serviceAssignment: {
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
  };
}
