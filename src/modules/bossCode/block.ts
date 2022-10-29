import { boss_models } from "src/resources/model_paths"
import * as SOUNDS from "../sounds";

export class Block {
    row: number
    col: number
    centerPos: Vector3
    abovePos: Vector3
    hidePos: Vector3
    sizeX: number
    sizeZ: number
    entity: Entity
    transpEntity: Entity

    constructor(_row: number, _col: number, _centerPos: Vector3, _abovePos: Vector3, _sizeX: number, _sizeZ: number) {
        this.row = _row
        this.col = _col
        this.centerPos = _centerPos
        this.abovePos = _abovePos
        this.sizeX = _sizeX
        this.sizeZ = _sizeZ


        this.entity = new Entity()
        this.entity.addComponent(new GLTFShape(boss_models.block))
        this.entity.addComponent(SOUNDS.woodExplodeSource)
        this.entity.addComponent(new Transform({
            position: new Vector3(this.centerPos.x, this.centerPos.y, this.centerPos.z),
            scale: new Vector3(this.sizeX, this.sizeX, this.sizeZ),
            rotation: Quaternion.Euler(0, Math.floor(Math.random() * 3) * 90, 0)
        }))

        let collider = new Entity()
        collider.addComponent(new Transform({ position: new Vector3(0, -0.01, 0), scale: new Vector3(1, 0.01, 1) }))
        collider.addComponent(new BoxShape())
        collider.getComponent(BoxShape).visible = false
        collider.getComponent(BoxShape).withCollisions = true
        collider.setParent(this.entity)
        engine.addEntity(this.entity)

        this.transpEntity = new Entity()
        this.transpEntity.addComponent(new GLTFShape(boss_models.transparentBlock))
        this.transpEntity.addComponent(new Transform({
            position: new Vector3(this.centerPos.x, -20, this.centerPos.z),
            scale: new Vector3(this.sizeX, this.sizeX, this.sizeZ),
            rotation: Quaternion.Euler(0, Math.floor(Math.random() * 3) * 90, 0)
        }))
        engine.addEntity(this.transpEntity)
    }

    hide(_timeout: number) {
        this.entity.getComponent(Transform).position.y = -20
        this.transpEntity.getComponent(Transform).position.y = this.centerPos.y
        //this.entity.getComponent(AudioSource).playOnce()

        engine.addSystem(new BlockTimeoutSystem(this, _timeout))
    }
    reset() {

        this.transpEntity.getComponent(Transform).position.y = -20
        this.entity.getComponent(Transform).position.y = this.centerPos.y

    }
}

export class BlockTimeoutSystem {

    block: Block
    timeout: number = 10
    elapsed: number = 0

    constructor(_block: Block, _time?: number) {
        this.block = _block
        if (_time) {
            this.timeout = _time
        }
        this.elapsed = 0
    }

    update(dt: number) {
        this.elapsed += dt
        if (this.elapsed > this.timeout) {
            this.block.reset()
            engine.removeSystem(this)
        }
    }
}