import * as utils from '@dcl/ecs-scene-utils'
import { standart_models } from 'src/resources/model_paths'



export class Gate extends Entity {
  private startPos: Vector3
  private endPos: Vector3

  private closed:boolean = true

  constructor(transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(new GLTFShape(standart_models.gate))
    this.addComponent(transform)
    this.startPos = this.getComponent(Transform).position
    this.endPos = new Vector3(this.startPos.x, this.startPos.y - 8, this.startPos.z)
  }
  openGate(): void {

    if(!this.closed) return

    this.addComponent(new utils.MoveTransformComponent(this.startPos, this.endPos, 3, () => {
    }))
    
    this.closed = false
  }
}
