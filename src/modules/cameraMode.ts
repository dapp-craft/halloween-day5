export const areaEntity = new Entity()
areaEntity.addComponentOrReplace(new Transform(
    {
        position: new Vector3(40, 15, 40)
    }
))

const area_box_on: Vector3 = new Vector3(80, 32, 80)
const camera_area = new CameraModeArea({
    area: { box: area_box_on },
    cameraMode: CameraMode.FirstPerson,
})
areaEntity.addComponent(camera_area)