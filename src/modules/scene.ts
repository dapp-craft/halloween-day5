export class Scene {
  scale: number = 5
  sizeX: number = 5 * 16
  sizeZ: number = 5 * 16
  center: Vector3 = new Vector3(this.sizeX / 2, 0, this.sizeZ / 2)
  mansionCenter: Vector3 = new Vector3(this.sizeX / 2 + 16, 0, this.sizeZ / 2)
  cultCircleCenter: Vector3 = new Vector3(this.mansionCenter.x - 6.43, 0, this.mansionCenter.z)
  pentagramPos: Vector3 = new Vector3(this.mansionCenter.x - 6.43, 0, this.mansionCenter.z)
  bossDeadPos: Vector3 = new Vector3(this.mansionCenter.x - 4, -8, this.cultCircleCenter.z)
  trapPosition1: Vector3 = new Vector3(this.mansionCenter.x - 11, 0, this.mansionCenter.z)
  mainDoorPos: Vector3 = new Vector3(this.mansionCenter.x - 18.8, 6.372, this.mansionCenter.z + 1.95)
  upperDoorPos: Vector3 = new Vector3(this.mansionCenter.x - 12, 20, this.mansionCenter.z)
  teleportPos: Vector3 = new Vector3(this.mansionCenter.x - 10, 21, this.mansionCenter.z)
  teleportLook: Vector3 = new Vector3(this.mansionCenter.x, 25, this.mansionCenter.z)
  isSceneLoaded: boolean = false
  bossIsDead: boolean = false
  guyToldEnding: boolean = false
  guyToldIntro: boolean = false
  doorPos: Vector3 = new Vector3(this.mansionCenter.x - 18, 0, this.mansionCenter.z)
  teleportGravePos: Vector3 = new Vector3(40.15, 0, 74.71)
  teleportOutsidePos: Vector3 = new Vector3(this.mansionCenter.x - 18.5, 0, this.mansionCenter.z)
  teleportArriveInward: Vector3 = new Vector3(this.mansionCenter.x - 16, 0, this.mansionCenter.z)
  teleportInsidePos: Vector3 = new Vector3(this.mansionCenter.x - 17.5, 0, this.mansionCenter.z)
  teleportArriveOutward: Vector3 = new Vector3(this.mansionCenter.x - 21, 0, this.mansionCenter.z)
  teleportScale: Vector3 = new Vector3(1, 4, 1.5)
  constructor() {

  }
}

// object to store world data
export const scene = new Scene()

export function ResetWorld() {
}