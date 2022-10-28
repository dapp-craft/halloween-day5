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
      ghost.playAnimation(`stand`, false)


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
}


export async function firstTimeTrigger(){
  setGunUseable()
      
  turnLeaderIntoGhost()    
  spawnGhosts()
  if (updateProgression('waypoint5')) {
    quest.checkBox(1)
    quest.showCheckBox(2)
  }

  
  
  UI.showGhostHealthUI(true)
}