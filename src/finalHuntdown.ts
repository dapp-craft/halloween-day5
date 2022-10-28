import {
  ghostBlasterDialogAtDoor,
  ghostBlasterDialogAtDoorShort,
  ghostBlasterDialogOutro,
  ghostBossDialog,
  ghostBlasterDialogOutroShort
} from './resources/dialog'
import { NPC, DialogWindow } from '@dcl/npc-scene-utils'
import * as ui from '@dcl/ui-scene-utils'
import { scene } from './modules/scene'
import { setGunUnUseable, setGunUseable } from './modules/gun'
import { player } from './modules/player'
import {halloweenTheme} from "./halloweenQuests/quest/questCheckBox";
import { spawnGhosts } from './modules/ghostEnemies'
import { turnLeaderIntoGhost } from './modules/boss/ghostBoss'
import * as UI from 'modules/ui'

import {
  updateProgression
} from './halloweenQuests/progression'
import { quest } from './halloweenQuests/quest/questTasks'

export let hunter: NPC
export let ghost: NPC
export let cultLeader: NPC
export let catLover: NPC
export let farmer: NPC
export let girlCult: NPC
export let cultist1: NPC
export let creep: NPC

const cultRadius = 4
export const cultistPositions = [
  scene.cultCircleCenter.add(Vector3.Right().multiplyByFloats(cultRadius, 0, 3).rotate(Quaternion.Euler(0, 25, 0))),
  scene.cultCircleCenter.add(Vector3.Right().multiplyByFloats(cultRadius, 0, 3).rotate(Quaternion.Euler(0, 70, 0))),
  scene.cultCircleCenter.add(Vector3.Right().multiplyByFloats(cultRadius, 0, 3).rotate(Quaternion.Euler(0, 335, 0))),
  scene.cultCircleCenter.add(Vector3.Right().multiplyByFloats(cultRadius, 0, 3).rotate(Quaternion.Euler(0, 295, 0))),
  scene.cultCircleCenter.add(Vector3.Right().multiplyByFloats(cultRadius, 0, 3).rotate(Quaternion.Euler(0, 75, 0))),
  scene.cultCircleCenter.add(Vector3.Right().multiplyByFloats(cultRadius, 0, 3).rotate(Quaternion.Euler(0, 100, 0))),
  scene.cultCircleCenter.add(Vector3.Right().multiplyByFloats(cultRadius, 0, 3).rotate(Quaternion.Euler(0, 285, 0))),
  scene.cultCircleCenter.add(Vector3.Right().multiplyByFloats(cultRadius, 0, 3).rotate(Quaternion.Euler(0, 260, 0)))
]

let cultLookatPoint = new Vector3(scene.mansionCenter.x, 0, scene.mansionCenter.z)


@Component("Cultist")
export class Cultist {

}




export function addNPCs() {

  creep = new NPC(
    {
      position: Vector3.Zero(),
      rotation: Quaternion.Euler(0, 0, 0),
    },
    'models/NPCs/creeper.glb',
    () => {
      // check for cat wearables
      //catLover.talk(catGuyDialog, 0)
      //catLover.playAnimation(`Head_Yes`, true, 2.63)
    },
    {
      portrait: { path: 'images/portraits/creep.png', height: 128, width: 128 },
      reactDistance: 5,
      faceUser: false,
      onlyExternalTrigger: true
    }
  )

  creep.dialog = new DialogWindow(
    { path: 'images/portraits/creep.png', height: 256, width: 256 },
    true,
    null,
    halloweenTheme
  )
  creep.dialog.leftClickIcon.positionX = 340 - 60
  creep.dialog.text.color = Color4.FromHexString('#8DFF34FF')


  catLover = new NPC(
    {
      position: cultistPositions[0],
      rotation: Quaternion.Euler(0, 0, 0),
    },
    'models/NPCs/catguy_cult.glb',
    () => {
      // check for cat wearables
      //catLover.talk(catGuyDialog, 0)
      //catLover.playAnimation(`Head_Yes`, true, 2.63)
    },
    {
      reactDistance: 20,
      idleAnim: `Idle_06`,
      faceUser: false,
      onlyETrigger: false
    }
  )


  farmer = new NPC(
    {
      position: cultistPositions[1],
      rotation: Quaternion.Euler(0, 0, 0),
    },
    'models/NPCs/farmer-cult-npc.glb',
    () => {
      // check for cat wearables
      //catLover.talk(catGuyDialog, 0)
      //farmer.playAnimation(`Head_Yes`, true, 2.63)
    },

    {
      reactDistance: 10,
      idleAnim: `Idle_05`,
      faceUser: false,
      onlyETrigger: false
    }
  )



  girlCult = new NPC(
    {
      position: cultistPositions[2],
      rotation: Quaternion.Euler(0, 0, 0),
    },
    'models/NPCs/girl_cult.glb',
    () => {
      // check for cat wearables
      //catLover.talk(catGuyDialog, 0)
      //castleGuy.faceUser=true
    },
    {
      reactDistance: 10,
      idleAnim: `Idle_04`,
      faceUser: false,
      onlyETrigger: false
    }
  )
  //castleGuy.getComponent(Transform).lookAt(scene.trapPosition1)

  cultist1 = new NPC(
    {
      position: cultistPositions[3],
      rotation: Quaternion.Euler(0, 0, 0),
    },
    'models/NPCs/ghost1.glb',
    () => {

    },
    {
      reactDistance: 10,
      idleAnim: `idle1_Armature.001`,
      faceUser: false,
      onlyETrigger: false
    }
  )
  //cultist1.getComponent(Transform).lookAt(scene.trapPosition1)

  hunter = new NPC(
    {
      position: new Vector3(scene.mansionCenter.x - 25, 0, scene.mansionCenter.z - 3.5),
      rotation: Quaternion.Euler(0, -45, 0),
    },
    'models/NPCs/hunter.glb',
    () => {

      if (hunter.dialog.isDialogOpen) {
        return
      }
      if (!scene.bossIsDead) {
        if (scene.guyToldIntro) {
          hunter.talk(ghostBlasterDialogAtDoorShort, 0)
        } else {
          hunter.talk(ghostBlasterDialogAtDoor, 0)
        }

      } else {
        setGunUnUseable()
        if (scene.guyToldEnding) {
          hunter.talk(ghostBlasterDialogOutroShort, 0)
        } else {
          hunter.talk(ghostBlasterDialogOutro, 0)
        }


      }

    },

    {
      portrait: { path: 'images/portraits/ghostblaster_suit.png', height: 256, width: 256 },
      reactDistance: 4,
      idleAnim: `stand`,
      faceUser: false,
      onlyExternalTrigger: false
    }

  )

  hunter.dialog = new DialogWindow(
    { path: 'images/portraits/ghostblaster_suit.png', height: 256, width: 256 },
    true,
    null,
    halloweenTheme
  )
  hunter.dialog.leftClickIcon.positionX = 340 - 60
  hunter.dialog.text.color = Color4.FromHexString('#8DFF34FF')


  //Evil Ghost 
  ghost = new NPC(
    {
      position: new Vector3(scene.mansionCenter.x, -20, scene.mansionCenter.z),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(4, 4, 4)
    },
    'models/ram_head.glb',
    () => {

      ghost.talk(ghostBossDialog, 0)
      ghost.playAnimation(`stand`, true, 3)


    },
    {
      portrait: { path: 'images/portraits/ghost_boss.png', height: 128, width: 128 },
      reactDistance: 4,
      idleAnim: `stand`,
      faceUser: false,
      onlyExternalTrigger: true
    }
  )

  ghost.dialog = new DialogWindow(
    { path: 'images/portraits/ghost_boss.png', height: 256, width: 256 },
    true,
    null,
    halloweenTheme
  )
  ghost.dialog.leftClickIcon.positionX = 340 - 60
  ghost.dialog.text.color = Color4.FromHexString('#8DFF34FF')

  // cult leader in human form
  cultLeader = new NPC(
    {
      position: scene.mansionCenter,
      rotation: Quaternion.Euler(0, -90, 0),
    },
    'models/NPCs/oldlady_cult.glb',
    () => {
      // check for cat wearables
      // cultLeader.talk(cultLeaderDialog, 0)
      // ghost.playAnimation(`Acknowledging_Armature`, true, 2.63)
      setGunUseable()
      
      turnLeaderIntoGhost()
      engine.removeEntity(catLover)
      engine.removeEntity(farmer)
      engine.removeEntity(girlCult)
      engine.removeEntity(cultist1)      
      spawnGhosts()
      quest.checkBox(1)
      quest.showCheckBox(2)
      updateProgression('waypoint5')
      
      UI.showGhostHealthUI(true)
      engine.addSystem(myCultTurnSystem)

    },
    {
      portrait: { path: 'images/portraits/oldlady_cult.png', height: 256, width: 256 },
      reactDistance: 4,
      idleAnim: `Weight_Shift_Armature`,
      faceUser: false,
      onlyExternalTrigger: true
    }

  )
  cultLeader.dialog = new DialogWindow(
    { path: 'images/portraits/oldlady_cult.png', height: 256, width: 256 },
    true,
    null,
    halloweenTheme
  )
  cultLeader.dialog.leftClickIcon.positionX = 340 - 60
  cultLeader.dialog.text.color = Color4.FromHexString('#8DFF34FF')


  catLover.getComponent(Transform).lookAt(cultLeader.getComponent(Transform).position)
  catLover.addComponent(new Cultist())

  farmer.getComponent(Transform).lookAt(cultLeader.getComponent(Transform).position)
  farmer.addComponent(new Cultist())

  girlCult.getComponent(Transform).lookAt(cultLeader.getComponent(Transform).position)
  girlCult.addComponent(new Cultist())

  cultist1.getComponent(Transform).lookAt(cultLeader.getComponent(Transform).position)
  cultist1.addComponent(new Cultist())

  //ghost.addComponent(new Cultist())
}



class CultTurnSystem {

  fraction: number = 0
  cultGroup = engine.getComponentGroup(Cultist, Transform)


  update(dt: number) {
    if (this.fraction < 1) {
      this.fraction += dt / 6
      cultLookatPoint = Vector3.Lerp(scene.mansionCenter, player.camera.feetPosition, this.fraction)
    }
    for (let npc of this.cultGroup.entities) {
      npc.getComponent(Transform).lookAt(cultLookatPoint)

    }
  }
}

let myCultTurnSystem = new CultTurnSystem()

