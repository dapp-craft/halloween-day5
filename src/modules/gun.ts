import * as tools from "./utilities";
import * as UI from "./ui";
import * as SOUNDS from "./sounds";
import { Ghost, ghostState } from "./ghostBoss";
import { GhostCollider, GhostSmall } from "./ghostEnemies";
import { ghost } from "../finalHuntdown";
import { ghostBossDialog } from "../resources/dialog";
import { Shootable } from "./shootables";


const player = Camera.instance

let gunShape =  new GLTFShape("models/ghost_gun.glb")
let beamShape =  new GLTFShape("models/beam.glb")

//TODO: CHANGE TO 5 in production
const damageRate = 6
const damageRateSmallGhost = 100
const damagePicture = 100

export let gunIsInHand = false
export let gunIsUseable = false

let hitPoint = new Entity()
//hitPoint.addComponent(new SphereShape())
//hitPoint.getComponent(SphereShape).withCollisions = false
hitPoint.addComponent(new Transform({position:new Vector3(16,0,16),scale:new Vector3(0.15,0.15,0.15)}))
engine.addEntity(hitPoint)



let beamMat = new Material()
beamMat.albedoColor = Color3.FromHexString('#113366')
beamMat.emissiveColor = Color3.White()
beamMat.emissiveIntensity = 2

let gunRelPosition = new Vector3(0.18, -0.2, 0.12)
let gunTipPosition = new Vector3(0, 0, 0.45)
let ghostGun = new Entity()

//ghostGun.addComponent(gunShape)

ghostGun.addComponent(
  new Transform({
    position: new Vector3(8,-10,8),
    rotation: Quaternion.Euler(-2,-3,0),
    scale: new Vector3(1,1,1)
  })
)
engine.addEntity(ghostGun)
ghostGun.addComponent(SOUNDS.beamPowerupSource)
//ghostGun.setParent(Attachable.FIRST_PERSON_CAMERA)

let gunLookat = new Entity()
//gunLookat.addComponent(new SphereShape())
//gunLookat.getComponent(SphereShape).withCollisions = false
gunLookat.addComponent(
  new Transform({
    position: Vector3.Forward(),   
    scale: new Vector3(0.1,0.1,0.1)   
  })
)
engine.addEntity(gunLookat)
gunLookat.setParent(Attachable.FIRST_PERSON_CAMERA)


let ghostGunShake = new Entity()
ghostGunShake.addComponent(gunShape)
ghostGunShake.addComponent(
  new Transform({
    position: Vector3.Zero(),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(1,1,1)
  })
)
ghostGunShake.setParent(ghostGun)

let gunTip = new Entity()
gunTip.addComponent(
  new Transform({
    position: gunTipPosition,
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(1,1,1)
  })
)
gunTip.addComponent(SOUNDS.beamSource)
gunTip.setParent(ghostGun)

let beam = new Entity()
beam.addComponent(beamShape)
beam.addComponent(
  new Transform({
    position: Vector3.Zero(),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(1,1,1)
  })
)
beam.setParent(gunTip)

let beamActive = false
let physicsCast = PhysicsCast.instance

export function giveGunToPlayer(){
    ghostGun.getComponent(Transform).position.copyFrom(gunRelPosition)
    ghostGun.setParent(Attachable.FIRST_PERSON_CAMERA)
    gunIsInHand = true

}

export function setGunUseable(){
    if(gunIsInHand){
        gunIsUseable = true
        //beamActive = false
    }
}

export function setGunUnUseable(){
    
      setGunInActive()
     gunIsUseable = false

}

export function setGunActive(){
    if(gunIsInHand && gunIsUseable){
        beamActive = true
        SOUNDS.beamSource.playing = true
        SOUNDS.beamPowerupSource.playOnce()
    
        // if(e.hit){
        //  // if(e.hit.hitPoint.x != 0 || e.hit.hitPoint.z != 0){
        //     hitPoint.getComponent(Transform).position = e.hit.hitPoint
        //   //}
        // }
    
        beam.getComponent(Transform).scale.setAll(1)
    }
    
}

export function setGunInActive(){
    //if(gunIsInHand && gunIsUseable){
        beamActive = false
        SOUNDS.beamSource.playing = false
        //updateBeamPoints(Vector3.Zero(),Vector3.Forward(),0,0)
        //beam.getComponent(Transform).scale.setAll(0.01)
    //}
}


class BeamGunSystem {

  elapsedTime = 0
  update(dt:number){
    if(beamActive){

      this.elapsedTime+=dt*10
      gunTip.getComponent(Transform).rotate(Vector3.Forward(), -50)
      ghostGunShake.getComponent(Transform).position.x = Math.random()*0.005
      ghostGunShake.getComponent(Transform).position.y = Math.random()*0.005      
          
      let rayFromCamera = physicsCast.getRayFromCamera(48)
      
      physicsCast.hitFirst(rayFromCamera, (e) => {
        if(e.didHit){
          hitPoint.getComponent(Transform).position.copyFrom(e.hitPoint)    
          beam.getComponent(Transform).scale.z = tools.realDistance(new Vector3(e.hitPoint.x,e.hitPoint.y, e.hitPoint.z),player.position)          
          gunLookat.getComponent(Transform).position.z = beam.getComponent(Transform).scale.z


          if(engine.entities[e.entity.entityId].hasComponent(Ghost)){
            const ghostInfo = engine.entities[e.entity.entityId].getComponent(Ghost)

            if(ghostInfo.state == ghostState.DIZZY){
              const transform =  engine.entities[e.entity.entityId].getComponent(Transform)
              //transform.scale.setAll(0.5 + ghostInfo.health/100 *1.5)              
              transform.position.x += Math.sin(this.elapsedTime*30)* 0.05
              transform.rotation.z += Math.sin(this.elapsedTime*30)* 0.05
              
              if(ghostInfo.health > 0){
                ghostInfo.health -= dt * damageRate
                UI.setGhostHealth(ghostInfo.health)
                ghost.playAnimation('Hit',true,1) 
              }
              //Trigger Ghost death dialog sequence
              else{
                ghostInfo.state = ghostState.DEATH 
                 SOUNDS.actionLoopSource.playing = false
                 SOUNDS.endingMusicSource.loop = true
                 SOUNDS.endingMusicSource.playing = true
                ghost.talk(ghostBossDialog,6)
                setGunUnUseable()
              } 

            }else if(ghostInfo.state == ghostState.TALKING){            

            }         
          }   

          if(engine.entities[e.entity.entityId].hasComponent(GhostCollider)){
            const ghostInfo = engine.entities[e.entity.entityId].getParent().getComponent(GhostSmall)

            if(ghostInfo.health > 0){
              ghostInfo.shake = true
              // const transform =  engine.entities[e.entity.entityId].getComponent(Transform)                          
              // transform.position.x += Math.sin(this.elapsedTime*30)* 0.05
              // transform.rotation.x += Math.sin(this.elapsedTime*30)* 0.05              
              
              ghostInfo.health -= dt * damageRateSmallGhost              
            }
            else{
              ghostInfo.alive = false
              ghostInfo.shake = false
              const transform =  engine.entities[e.entity.entityId].getComponent(Transform)
              transform.scale.y = 0.1                
              ghostInfo.health = 0
                
            }

          } 
          
          if(engine.entities[e.entity.entityId].hasComponent(Shootable)){
            const shootableObject = engine.entities[e.entity.entityId].getComponent(Shootable)
            shootableObject.onShoot()

            if(shootableObject.alive){
              if(shootableObject.health > 0){
                shootableObject.health -= dt*damagePicture
              }
              else{
                shootableObject.alive = false
                shootableObject.onDeath()
              }
            }
          }
        }               
                       
                     
      })   
      
      ghostGun.getComponent(Transform).lookAt(gunLookat.getComponent(Transform).position)
    }    
    else{
      beam.getComponent(Transform).scale.setAll(0.01)
      gunLookat.getComponent(Transform).position = Vector3.Forward().multiplyByFloats(0,0,10)
      ghostGun.getComponent(Transform).lookAt(gunLookat.getComponent(Transform).position)
    }  
  } 
}
engine.addSystem(new BeamGunSystem())
