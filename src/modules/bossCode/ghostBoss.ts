import * as tools from "../utilities";
import * as UI from "../ui";
import { player } from "../player";
import * as SOUNDS from "../sounds";
import { movePlayerTo } from '@decentraland/RestrictedActions'


import { removeGhosts } from "../ghostEnemies";
import { grid } from "../grid";
import { scene } from "../scene";
import { setGunUnUseable, setGunUseable } from "../gun";
import { boss_models } from "src/resources/model_paths";
import { Block } from "./block";
import {addOnBossDead, Ghost, ghostState} from "./ghostDef";
import {NPC} from "@dcl/npc-scene-utils";
import {updateProgression} from "../../halloweenQuests/progression";
import {quest} from "../../halloweenQuests/quest/questTasks";


let ghost:NPC
let girl:NPC
let hunter:NPC


let playerBeenInRoom = false

export let upperDoor = new Entity()
upperDoor.addComponent(new Transform({ position: scene.upperDoorPos }))
upperDoor.addComponent(new GLTFShape(boss_models.upperDoor))
engine.addEntity(upperDoor)
upperDoor.addComponent(new OnPointerDown((e) => {
    resetAllBlocks()
    movePlayerTo(scene.teleportPos)

}, {
    button: ActionButton.PRIMARY,
    showFeedback: true,
    hoverText: "Fight the Cult Leader",
    distance: 5
}))

let bigFlame = new Entity()

let eyeMat = new Material()
eyeMat.albedoColor = Color3.FromHexString('#000000')
eyeMat.roughness = 0.5
eyeMat.specularIntensity = 0
eyeMat.metallic = 0.3

let pentaLights = new Entity()
pentaLights.addComponent(new Transform({
    position: scene.pentagramPos,
    scale: new Vector3(1, 0, 1)
}))
pentaLights.addComponent(new GLTFShape(boss_models.pentaLight))
engine.addEntity(pentaLights)


let bossEntrySound = new Entity()
bossEntrySound.addComponent(SOUNDS.bossEntrySource)
bossEntrySound.addComponent(new Transform({ position: grid.center }))
engine.addEntity(bossEntrySound)

let actionLoopMusic = new Entity()
actionLoopMusic.addComponent(SOUNDS.actionLoopSource)
actionLoopMusic.addComponent(new Transform({ position: new Vector3(0, 1, 0) }))
engine.addEntity(actionLoopMusic)
SOUNDS.actionLoopSource.loop = true
actionLoopMusic.setParent(Attachable.AVATAR)


let thunderSound = new Entity()
thunderSound.addComponent(SOUNDS.thunderSource)
thunderSound.addComponent(new Transform({ position: new Vector3(grid.center.x, 5, grid.center.z) }))
engine.addEntity(thunderSound)

let ghostDisappearSound = new Entity()
ghostDisappearSound.addComponent(SOUNDS.ghostDisappearSource)
ghostDisappearSound.addComponent(new Transform({ position: new Vector3(scene.pentagramPos.x, 1, scene.pentagramPos.z) }))
engine.addEntity(ghostDisappearSound)


let endingMusic = new Entity()
endingMusic.addComponent(SOUNDS.endingMusicSource)
endingMusic.addComponent(new Transform({ position: new Vector3(grid.center.x, 5, grid.center.z) }))
engine.addEntity(endingMusic)


export let blocks: Block[] = []

// initialize grid of blocks
for (let i = 0; i < grid.blocksX; i++) {
    for (let j = 0; j < grid.blocksZ; j++) {
        blocks.push(new Block(
            i,
            j,
            new Vector3((grid.blockSizeX / 2 + i * grid.blockSizeX) + grid.offsetX, grid.groundLevel, (grid.blockSizeZ / 2 + j * grid.blockSizeZ) + grid.offsetZ),
            new Vector3((grid.blockSizeX / 2 + i * grid.blockSizeX) + grid.offsetX, grid.groundLevel + grid.aboveLevel, (grid.blockSizeZ / 2 + j * grid.blockSizeZ) + grid.offsetZ),
            grid.blockSizeX * 0.99,
            grid.blockSizeZ * 0.99
        ))
    }
}

function getBlock(_x: number, _z: number): Block {

    if (_x < 0 || _z < 0 || _x >= grid.blocksX || _z >= grid.blocksZ) {
        log("no block exists with coordinates: x: " + _x + " z: " + _z)
        return null
    }
    return blocks[_x * grid.blocksX + _z]
}

function hideAllBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].hide(3)

    }
    SOUNDS.woodExplodeSource.playOnce()
}
function resetAllBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].reset()
    }
}


// let roomLock = new Entity()
// roomLock.addComponent(new Transform({
//     position: new Vector3(grid.center.x, grid.groundLevel, grid.center.z),
//     scale: new Vector3(grid.sizeX - 0.6, 6, grid.sizeZ - 0.6)
// }
// ))
// roomLock.addComponent(new GLTFShape(boss_models.roomLock))
// engine.addEntity(roomLock)

function isPlayerInsideRoom(_pos: Vector3): boolean {

    if (_pos.y >= grid.groundLevel) {
        if (_pos.x > grid.minX && _pos.x < grid.maxX && _pos.z > grid.minZ && _pos.z < grid.maxZ) {
            return true
        }
    }

    return false
}

export function StartBossFight() {
    ghost.getComponent(Ghost).state = ghostState.MOVING
}


export function turnLeaderIntoGhost() {

    ghost.getComponent(Ghost).state = ghostState.APPEAR
    ghost.getComponent(Transform).position = scene.mansionCenter
    //ghost.playAnimation('Appear', true, 3)
    SOUNDS.ghostDisappearSource.playOnce()
    engine.addSystem(new PentaLightSystem())
}



export class LockRoomSystem {

    update(dt: number) {

        if (ghost.getComponent(Ghost).state != ghostState.DEAD && ghost.getComponent(Ghost).state != ghostState.HIDDEN) {

            if (isPlayerInsideRoom(player.camera.feetPosition)) {

                if (!playerBeenInRoom) {
                    SOUNDS.musicSource.playing = false
                    SOUNDS.bossEntrySource.playOnce()
                    if (ghost.getComponent(Ghost).state == ghostState.TALKING) {
                        ghost.onActivate()
                        setGunUnUseable()
                    } else {
                        ghost.getComponent(Ghost).state = ghostState.MOVING
                    }
                    playerBeenInRoom = true
                }
                //roomLock.getComponent(Transform).scale.y = 4

            } else {
                //player fell
                if (playerBeenInRoom) {
                    ghost.getComponent(Ghost).state = ghostState.WAITING
                    SOUNDS.musicSource.loop = true
                    SOUNDS.musicSource.playing = true
                }
                playerBeenInRoom = false

                // roomLock.getComponent(Transform).scale.y = 0
            }
        } else {
            playerBeenInRoom = false
            SOUNDS.actionLoopSource.playing = false
            //roomLock.getComponent(Transform).scale.y = 0
        }

    }
}

let myLockRoomSystem = new LockRoomSystem()



export class PentaLightSystem {
    fraction = 0
    update(dt: number) {
        if (this.fraction < 4) {
            this.fraction += dt
            pentaLights.getComponent(Transform).scale.y = 2 - this.fraction / 2
        } else {
            pentaLights.getComponent(Transform).scale.y = 0
            engine.removeSystem(this)
        }
    }
}
export class GhostMoveSystem {

    hasTarget = false
    target: Vector3 = new Vector3(16, grid.aboveLevel, 16)
    targetBlock: Block
    moveVector: Vector3
    speed: number = 0.5
    moveCount: number = 0
    movesBeforeAttack: number = 5
    timer: number = 0
    anticipationTime: number = 0.5
    appearTime: number = 2
    attackTime: number = 0.5
    dizzyTime: number = 4
    waitingTime: number = 20
    deathTimer: number = 0
    fallFraction: number = 0
    lookTarget: Vector3 = new Vector3(scene.cultCircleCenter.x, 1.0, scene.cultCircleCenter.z)
    breakthrough: boolean = false

    update(dt: number) {
        const transform = ghost.getComponent(Transform)
        const ghostInfo = ghost.getComponent(Ghost)


        switch (ghostInfo.state) {

            case ghostState.MOVING: {

                if (this.moveCount < this.movesBeforeAttack) {

                    if (!this.hasTarget) {
                        if (this.moveCount < this.movesBeforeAttack - 1) {
                            let randomBlock = Math.floor(Math.random() * grid.blockCount)
                            this.targetBlock = blocks[randomBlock]
                            this.target = this.targetBlock.abovePos
                            this.hasTarget = true
                        }
                        else {

                            let pX = player.camera.feetPosition.x - grid.offsetX
                            let pZ = player.camera.feetPosition.z - grid.offsetZ

                            let pRow = Math.floor(pX / grid.blockSizeX)
                            let pCol = Math.floor(pZ / grid.blockSizeZ)

                            log("rowX: " + pRow + "\n" + "colZ: " + pCol)

                            this.targetBlock = getBlock(pRow, pCol)
                            if (this.targetBlock == null) {
                                this.targetBlock = blocks[0]
                            }
                            this.target = this.targetBlock.abovePos
                            this.hasTarget = true
                        }

                    }

                    if (this.hasTarget) {
                        this.moveVector = this.target.subtract(transform.position).normalize().multiplyByFloats(this.speed, this.speed, this.speed)
                        let nextPosition = transform.position.add(this.moveVector)
                        transform.position.copyFrom(nextPosition)
                        //transform.position = Vector3.Lerp(transform.position, this.target, dt*2)

                        if (tools.distance(transform.position, this.target) < 1) {
                            this.hasTarget = false
                            this.moveCount++
                        }
                    }

                } else {
                    ghostInfo.state = ghostState.ANTICIPATING
                    this.moveCount = 0
                }
                break
            }
            case ghostState.APPEAR: {
                this.timer += dt
                if (this.timer >= this.appearTime) {

                    if (transform.position.y < grid.center.y) {
                        transform.position.y += 5 * dt

                        if (!this.breakthrough) {
                            if (transform.position.y > grid.center.y - 10) {
                                this.breakthrough = true
                                hideAllBlocks()
                            }
                        }
                    }
                    else {

                        transform.position.y = grid.center.y
                        ghostInfo.state = ghostState.TALKING
                        this.timer = 0
                    }
                }

                break
            }

            case ghostState.ANTICIPATING: {
                this.timer += dt
                if (this.timer >= this.anticipationTime) {
                    ghostInfo.state = ghostState.ATTACKING
                    this.timer = 0
                    SOUNDS.swishSource.playOnce()
                }
                else {
                    transform.position.y += dt * 1
                }

                break
            }

            case ghostState.ATTACKING: {
                this.timer += dt
                if (this.timer >= this.attackTime) {
                    ghostInfo.state = ghostState.DIZZY
                    //ghost.playAnimation(`Idle_002`, false)
                    this.timer = 0
                    this.targetBlock.hide(16)
                    //transform.scale.y = 2
                }
                else {
                    transform.position.y -= 0.5
                    //transform.scale.y = 3
                }
                break
            }
            case ghostState.DIZZY: {
                this.timer += dt
                if (this.timer >= this.dizzyTime) {
                    ghostInfo.state = ghostState.MOVING
                    //ghost.playAnimation(`Idle_001`, false)
                    this.timer = 0
                    // this.targetBlock.reset()
                    this.movesBeforeAttack = Math.floor(Math.random() * 3 + 2)
                }
                else {
                    transform.position.y = this.targetBlock.centerPos.y - 0.5
                }
                break
            }

            case ghostState.WAITING: {
                this.timer += dt
                transform.position = new Vector3(grid.center.x, grid.center.y + Math.sin(this.timer * 4) * 0.4, grid.center.z)
                //transform.position = new Vector3(grid.center.x+ Math.sin(this.timer*100) * 0.2, grid.center.y + Math.sin(this.timer*120) * 0.42, grid.center.z+ Math.sin(this.timer*90) * 0.2)      

                //health regeneration
                if (ghostInfo.health < 100) {
                    ghostInfo.health += dt * ghostInfo.healthRegenRate
                    //transform.scale.setAll(0.5 + ghostInfo.health/100 *1.5)
                    UI.setGhostHealth(ghostInfo.health)
                }
                else {
                    ghostInfo.health = 100
                    //transform.scale.setAll(0.5 + ghostInfo.health/100 *1.5)
                    UI.setGhostHealth(ghostInfo.health)
                }
                break
            }

            case ghostState.TALKING: {
                this.timer += dt
                transform.position = new Vector3(grid.center.x, grid.center.y + Math.sin(this.timer * 4) * 0.4, grid.center.z)

                //ghost.onActivate()
                //health regeneration
                if (ghostInfo.health < 100) {
                    ghostInfo.health += dt * ghostInfo.healthRegenRate
                    UI.setGhostHealth(ghostInfo.health)
                }
                else {
                    ghostInfo.health = 100
                    UI.setGhostHealth(ghostInfo.health)
                }
                break
            }
            case ghostState.DEATH: {
                this.deathTimer += dt

                if (this.deathTimer < 4) {
                    resetAllBlocks()
                    transform.position = Vector3.Lerp(transform.position, grid.center, this.deathTimer / 4)
                    transform.position.x += Math.sin(this.deathTimer * 100) * 0.1
                    transform.position.y += Math.sin(this.deathTimer * 120) * 0.2
                    transform.position.z += Math.sin(this.deathTimer * 90) * 0.1
                }
                else {
                    transform.position.x += Math.sin(this.deathTimer * 100) * 0.1
                    transform.position.y += Math.sin(this.deathTimer * 120) * 0.2
                    transform.position.z += Math.sin(this.deathTimer * 90) * 0.1
                }
                break
            }
            case ghostState.DEAD: {
                transform.lookAt(scene.bossDeadPos)
                bigFlame.getComponent(Transform).rotation = Quaternion.Euler(-45, 0, 0)
                bigFlame.getComponent(Transform).position.set(0, 0.8, 0.1)

                this.fallFraction += dt * 0.5

                transform.position = Vector3.Lerp(grid.center, scene.bossDeadPos, this.fallFraction)

                if (this.fallFraction > 1) {
                    ghostInfo.state = ghostState.HIDDEN
                    engine.addSystem(new PentaLightSystem())
                    engine.removeSystem(myLockRoomSystem)
                    engine.removeEntity(ghost)
                    engine.removeSystem(this)
                }

                break
            }
            case ghostState.HIDDEN: {
                transform.position.y = -20
                break
            }
        }
        if (ghostInfo.state != ghostState.DEAD) {

            if (tools.distance(player.camera.position, this.lookTarget) > 0.5) {
                let moveVector = player.camera.position.subtract(this.lookTarget).normalizeToNew()
                let nextPos = this.lookTarget.add(moveVector.multiplyByFloats(0.3, 0.3, 0.3))
                this.lookTarget.copyFrom(nextPos)

            }
            transform.lookAt(this.lookTarget)

        }



    }
}

function onDead() {
    try {
        scene.bossIsDead = true
        ghost.getComponent(Transform).scale.setAll(0)
        //ghost.playAnimation(`Death`, true, 2.63)
        hideAllBlocks()
        //engine.removeSystem(playerFallSys)
        ghost.getComponent(Ghost).state = ghostState.DEAD
        removeGhosts()
        SOUNDS.endingMusicSource.loop = true
        SOUNDS.endingMusicSource.playing = true
        SOUNDS.thunderSource.playOnce()
        SOUNDS.ghostDisappearSource.playOnce()
        hunter.getComponent(Transform).position.y = -10
        girl.getComponent(Transform).position.y = 0.2
        setGunUseable()
        //engine.removeEntity(roomLock)
        engine.removeEntity(upperDoor)
        executeTask(async () => {
            if (await updateProgression('ghostDefeated')) {
                quest.checkBox(2)
                quest.showCheckBox(3)
            }
        })
    } catch (e) {
        log('err', e.message)
    }
}

export function bossInit(ghost_, girl_, hunter_) {
    ghost = ghost_
    girl = girl_
    hunter = hunter_
    addOnBossDead(onDead)
}

export function addBoss() {
    //BOSS GHOST NPC

    ghost.addComponent(new Ghost())
    ghost.addComponent(SOUNDS.swishSource)

    bigFlame.addComponent(new Transform({ position: new Vector3(0, 0, -0.1) }))
    bigFlame.addComponent(new GLTFShape(boss_models.blueFlame))
    bigFlame.setParent(ghost)
    //engine.addEntity(bigFlame)
    engine.addEntity(ghost)


    engine.addSystem(new GhostMoveSystem())
    engine.addSystem(myLockRoomSystem)

}