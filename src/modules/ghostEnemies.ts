import {  cultistPositions  } from "../finalHuntdown";
import { NPC } from '@dcl/npc-scene-utils'
import {  scene  } from "./scene";

let ghostSmallShape:string =  "models/NPCs/ghosts-bence.glb"
let starsShape:GLTFShape  =  new GLTFShape("models/stars.glb")
let electricShape:GLTFShape =  new GLTFShape("models/ghost_electric.glb")
let colliderShape = new BoxShape()
colliderShape.visible = false
@Component("GhostCollider")
export class GhostCollider {  }
@Component("GhostSmall")
export class GhostSmall {  
    health:number = 100         
    speed:number = 6         
    reviveTime:number = 5     
    elapsedTime:number = 0
    deathTimer:number = 0
    level:number = 0
    alive:boolean = true
    spawnPoint:Vector3
    spawnFraction:number = 0
    waypointReached:boolean = false
    waypoint1:Vector3
    waypoint2:Vector3
    fraction:number = 0
    shake:boolean = false
    shakeTimer:number = 0
    rotation1:Quaternion
    rotation2:Quaternion
    stars:Entity
    electric:Entity
    collider:Entity
    hideSpot:Vector3
    randomDelay:number = 0
    delayTimer:number = 0
    lastPlayedAnim:AnimationState 

    constructor(_wp1:Vector3, _wp2:Vector3, _level:number, _spawn:Vector3){
        this.spawnPoint = _spawn
        
        this.waypoint1 = _wp1
        this.waypoint2 = _wp2
        this.level = _level
        this.speed = 6 + (Math.random()*2-1)
        this.elapsedTime = 0
        
        this.rotation1 = Quaternion.FromToRotation(Vector3.Forward(),_wp1.subtract(_wp2))
        this.rotation2 = Quaternion.FromToRotation(Vector3.Forward(),_wp2.subtract(_wp1))
        this.stars = new Entity()
        this.stars.addComponent(starsShape)
        this.stars.addComponent(new Transform({position:new Vector3(8,-20,8)}))
        
        this.electric = new Entity()
        this.electric.addComponent(electricShape)
        this.electric.addComponent(new Transform({position:new Vector3(0,0,0), scale: Vector3.Zero()}))
        
        this.collider = new Entity()
        this.collider.addComponent(colliderShape)
        this.collider.getComponent(BoxShape).visible = false
        this.collider.addComponent(new GhostCollider())
        
        this.collider.addComponent(new Transform({position:new Vector3(0,0,0), scale: new Vector3(3,3,3)}))

        this.hideSpot = new Vector3(8,-20,8)
        this.randomDelay = Math.random()*0.3

        
        
    }

}

//dummy ghost
let dummyGhost = spawnGhostSmall(new Vector3(scene.mansionCenter.x+1, -10 ,scene.mansionCenter.z +1),  new Vector3(scene.mansionCenter.x+1, -10 ,scene.mansionCenter.z +1),    5 +1, new Vector3(scene.mansionCenter.x, -10 ,scene.mansionCenter.z))

let smallGhosts:NPC[] = []

export function spawnGhostSmall(_wp1:Vector3, _wp2:Vector3, _level:number, _spawn:Vector3):NPC{

    let ghostEnemy = new NPC(
        {
          position: _spawn,
          rotation: Quaternion.Euler(0, 0, 0),
        },
        ghostSmallShape,
        () => {
          ghostEnemy.playAnimation('idle')
        },
        {
            portrait:{ path: 'images/radio3.png', height: 128, width: 128 },
            reactDistance:20,
            idleAnim:`idle`,
            faceUser:false,
            onlyETrigger:true
        },

      )

    //ghostEnemy.addComponent(new Transform({position: _spawn, scale: new Vector3(1,1,1)}))
    ghostEnemy.addComponent(new GhostSmall(_wp1,_wp2,_level,_spawn))    
    //ghostEnemy.addComponent(ghostSmallShape) 
    engine.addEntity(ghostEnemy)
    engine.addEntity(ghostEnemy.getComponent(GhostSmall).stars)
    ghostEnemy.getComponent(GhostSmall).electric.setParent(ghostEnemy)
    ghostEnemy.getComponent(GhostSmall).collider.setParent(ghostEnemy)
  
    

    return ghostEnemy
}

export function spawnGhosts(){


    smallGhosts.push( spawnGhostSmall(new Vector3(scene.mansionCenter.x+13, 5 +1 ,scene.mansionCenter.z - 14),  new Vector3(scene.mansionCenter.x - 14,5 +1,scene.mansionCenter.z- 14),    5 +1, cultistPositions[0]) )
    smallGhosts.push( spawnGhostSmall(new Vector3(scene.mansionCenter.x+13, 10 +1,scene.mansionCenter.z - 14), new Vector3(scene.mansionCenter.x - 1,10 +1,scene.mansionCenter.z - 14), 10 +1, cultistPositions[1]) )
    smallGhosts.push( spawnGhostSmall(new Vector3(scene.mansionCenter.x+13, 10 +1,scene.mansionCenter.z + 14), new Vector3(scene.mansionCenter.x + 2,10 +1,scene.mansionCenter.z + 14), 10 +1, cultistPositions[2]) )
    smallGhosts.push( spawnGhostSmall(new Vector3(scene.mansionCenter.x+13, 15 +1,scene.mansionCenter.z - 14), new Vector3(scene.mansionCenter.x - 14,15 +1,scene.mansionCenter.z - 14), 15 +1, cultistPositions[3]) )
    smallGhosts.push( spawnGhostSmall(new Vector3(scene.mansionCenter.x+13, 15 +1,scene.mansionCenter.z + 14), new Vector3(scene.mansionCenter.x - 14,15 +1,scene.mansionCenter.z+14), 15 +1, cultistPositions[4]) )
    smallGhosts.push( spawnGhostSmall(new Vector3(scene.mansionCenter.x+14, 15 +1,scene.mansionCenter.z + 14), new Vector3(scene.mansionCenter.x + 14,15 +1,scene.mansionCenter.z - 14), 15 +1, cultistPositions[5]) )
    smallGhosts.push( spawnGhostSmall(new Vector3(scene.mansionCenter.x - 14,15 +1,scene.mansionCenter.z - 1), new Vector3(scene.mansionCenter.x - 14,15 +1,scene.mansionCenter.z - 12), 15 +1, cultistPositions[6]) )
    smallGhosts.push( spawnGhostSmall(new Vector3(scene.mansionCenter.x + 13, 5 +1,scene.mansionCenter.z + 14),  new Vector3(scene.mansionCenter.x - 14,5 +1,scene.mansionCenter.z+14), 5 +1,    cultistPositions[7]) )  
    engine.removeEntity(dummyGhost)

}

//spawnGhosts()

export function removeGhosts(){
    for(let i=0; i< smallGhosts.length; i++){
        engine.removeEntity(smallGhosts[i])
    }

}


class ghostPatrolSystem {

    //jump height
    amplitude = 0.4
    frequency = 5
    //group = engine.getComponentGroup(GhostSmall,Transform)
    
  
    update(dt: number) {   
  
       for (let entity of smallGhosts) {
  
        const objectInfo = entity.getComponent(GhostSmall)      
        let transform = entity.getComponentOrCreate(Transform)       
        let colliderTransform = objectInfo.collider.getComponent(Transform)      
        
        
        if(!objectInfo.waypointReached){

            if(objectInfo.delayTimer < objectInfo.randomDelay){
                objectInfo.delayTimer += dt/2
                transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.FromToRotation(Vector3.Forward(), objectInfo.waypoint1.multiplyByFloats(1,0,1).subtract(transform.position)),objectInfo.delayTimer)
            }
            else{
                objectInfo.spawnFraction += dt/2

                if(objectInfo.spawnFraction > 1){
                    objectInfo.spawnFraction = 1
                    objectInfo.waypointReached = true
                }
                transform.position = Vector3.Lerp(objectInfo.spawnPoint, objectInfo.waypoint1,objectInfo.spawnFraction)
                transform.lookAt(objectInfo.waypoint1)
            }               
            
        }
        else{
            if(objectInfo.alive){
                objectInfo.elapsedTime += dt
                this.amplitude = 0.2
                this.frequency = 8   
                 
      
                  //alternating between waypoints
                  let nextFraction = 1 - Math.abs((objectInfo.elapsedTime/objectInfo.speed) % (2) - 1)
      
                  //alternating rotation after each waypoint is reached
                  if(nextFraction - objectInfo.fraction > 0){
                      transform.rotation.copyFrom(objectInfo.rotation2)
                  }
                  else{
                      transform.rotation.copyFrom(objectInfo.rotation1)
                  }
                  objectInfo.fraction = nextFraction
                  transform.position = Vector3.Lerp(objectInfo.waypoint1, objectInfo.waypoint2, objectInfo.fraction)
      
                  //bounce movement (bouncy sine wave)
                  transform.position.y = objectInfo.level + Math.sin(objectInfo.elapsedTime * this.frequency) * this.amplitude
                  transform.position.x +=  Math.sin(objectInfo.elapsedTime * this.frequency) * this.amplitude
                  transform.scale.y = 1 + Math.sin((objectInfo.elapsedTime + 0.5)  * this.frequency)*0.05
      
                  //damage shake
                  if(objectInfo.shake){                     
                    entity.playAnimation(`panic`, false, 1.83)
                    objectInfo.shakeTimer += dt
                    transform.position.x += Math.sin(objectInfo.shakeTimer*60)* 0.02
                    transform.position.z += Math.cos(objectInfo.shakeTimer*60)* 0.02
                    transform.rotation.x += Math.sin(objectInfo.shakeTimer*60)* 0.02
                    transform.rotation.z += Math.cos(objectInfo.shakeTimer*60)* 0.02
                    objectInfo.shake = false
                    objectInfo.electric.getComponent(Transform).scale.setAll(1)
                    
                  }else{
                    objectInfo.electric.getComponent(Transform).scale.setAll(0)
                    entity.playAnimation('idle', false)
                    
                  }
                
              }
              //Dead state
              else{
                  entity.playAnimation('die',true,3)
                  objectInfo.electric.getComponent(Transform).scale.setAll(0)
                  colliderTransform.position.y = -1
                  colliderTransform.scale.y = 0.2                 
                  objectInfo.deathTimer += dt
      
                  objectInfo.stars.getComponent(Transform).position.copyFrom (transform.position)
                  objectInfo.stars.getComponent(Transform).rotate(Vector3.Up(), -300*dt)
      
                  if(objectInfo.deathTimer > objectInfo.reviveTime){
                      objectInfo.alive = true
                      transform.scale.setAll(1)               
                      objectInfo.deathTimer = 0
                      objectInfo.health = 100
                      transform.rotation = Quaternion.Euler(0,0,0)
                      objectInfo.stars.getComponent(Transform).position.copyFrom (objectInfo.hideSpot)
                      colliderTransform.position.y = 0
                      colliderTransform.scale.y = 3
                  }
              }
        }
        
          
       
      } 
    }
  }
  
  engine.addSystem(new ghostPatrolSystem())