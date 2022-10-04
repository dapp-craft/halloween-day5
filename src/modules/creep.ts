import { player } from "./player";
import { creep } from "../finalHuntdown"
import { NPC } from '@dcl/npc-scene-utils'
import { creepDialog1 ,creepDialog2, creepDialog3, creepDialog4, creepDialogShort} from "../NPC/dialog";
//let treeShape = new GLTFShape('models/hide_tree.glb')
let treeColliderShape = new GLTFShape('models/tree_collider.glb')

let creeperState=0
const maxCreeperState=2


const treePos1 = new Vector3(64.709,0, 74.831)
const treePos2 = new Vector3(74.285,0, 4.89)
const treePos3 = new Vector3(8.0728,0, 33.858)
const creepingRotation = Quaternion.Euler(0,0,20)
const hidingRotation =  Quaternion.Euler(0,0,0)
const hidingDistance =  400

let creeperPositions = []

creeperPositions.push(treePos1)
creeperPositions.push(treePos2)
creeperPositions.push(treePos3)

// let treeShape = new GLTFShape('models/NPCs/hiding_tree.glb')
// const tree = new Entity()
// tree.addComponent(new Transform({ position: new Vector3(8, 0, 8) }))
// tree.addComponent(treeShape)
// engine.addEntity(tree)



//let creeperShape = new GLTFShape('models/NPCs/creeper.glb')


const creeperRoot = new Entity()
creeperRoot.addComponent(new Transform({ position: creeperPositions[0] }))
creeperRoot.addComponent(new Billboard(false,true,false))


//const creep = new Entity()
//creep.addComponent(new Transform())
//creep.addComponent(creeperShape)


const treeCollider = new Entity()
treeCollider.addComponent(new Transform({position:treePos1, scale:new  Vector3(1,1,1)}))
treeCollider.addComponent(treeColliderShape)

treeCollider.addComponent(new OnPointerDown((e) => {
    moveCreeperToNext()
  },{
    button: ActionButton.PRIMARY,
    showFeedback: true,
    hoverText: "Shake tree",
    distance:5
  }))


export function addCreeper(){
  if(creep != null){
    creep.setParent(creeperRoot)
    engine.addEntity(creeperRoot)

    engine.addEntity(treeCollider)
    engine.addSystem(new creeperSystem())
  }
  
}
function moveCreeperToNext(){
    if(creeperState + 1 < creeperPositions.length){
        treeCollider.getComponent(Transform).position.copyFrom(creeperPositions[creeperState+1])
        creeperRoot.getComponent(Transform).position.copyFrom(creeperPositions[creeperState+1])
    }
        switch(creeperState){
            case 0:{
                creep.talk(creepDialog1,0,5)
                creeperState += 1
                break
            }
            case 1:{
                creep.talk(creepDialog2,0,5)
                creeperState += 1
                break
            }
            case 2:{
                creep.talk(creepDialog4,0)
                creeperState += 1
                break
            }
            case 3:{
              creep.talk(creepDialogShort,0)
            }
            
        }       
    
}

function distance(pos1: Vector3, pos2: Vector3): number {
  const a = pos1.x - pos2.x
  const b = pos1.z - pos2.z
  return a * a + b * b
}

class creeperSystem { 
  playerDist = hidingDistance
  fraction = 0

  update(dt:number){   

    this.playerDist = distance(player.camera.feetPosition,creeperPositions[creeperState])
    const transform = creep.getComponent(Transform)
   
      
    if(this.playerDist < hidingDistance){  
      this.fraction +=dt  
      if(this.fraction <=1){
        transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.Euler(0,0,0), this.fraction)   
      }
      else{
          this.fraction = 1
      }
         
    }
    else{    
      transform.rotation = Quaternion.Slerp(transform.rotation, creepingRotation, 0.2)   
      this.fraction =0 
    }
  }
}
