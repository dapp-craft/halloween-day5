import * as UI from 'modules/ui'

import {
  progression,
  updateProgression
} from './halloweenQuests/progression'
import { quest } from './halloweenQuests/quest/questTasks'

import {
  hunterAfterBossDeath,
  hunterAtDoorShort,
  ghostBossDialog,
  goodGirlDialog,
  goodGirlOutro, initDialogsDeps, hunterAtDoor
} from './resources/dialog'

import { NPC, DialogWindow } from '@dcl/npc-scene-utils'
import { scene } from './modules/scene'
import { BeamGunSystem, giveGunToPlayer, setGunUseable } from './modules/gun'
import { halloweenTheme } from "./halloweenQuests/quest/questCheckBox";
import { spawnGhosts } from './modules/ghostEnemies'
import { BlendedNPC } from './modules/npc'
import { bossInit, turnLeaderIntoGhost } from './modules/bossCode/ghostBoss'
import { Reward } from './halloweenQuests/loot'
import { enableTunnelGrave, initTeleport } from "./modules/allowPlayerIn";





export let hunter: BlendedNPC
export let ghost: NPC
export let creep: NPC
export let girl: BlendedNPC



let cultLookatPoint = new Vector3(scene.mansionCenter.x, 0, scene.mansionCenter.z)


@Component("Cultist")
export class Cultist {

}

export function createNPCs() {

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
      onlyExternalTrigger: true,
      continueOnWalkAway: true
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

  const hunterIdleTiming: number[] = [4.3, 2.5, 2.3]
  hunter = new BlendedNPC('models/NPCs/hunter.glb', 'images/portraits/ghostblaster_suit.png', hunterIdleTiming)
  hunter.currentDialog = hunterAtDoor(
    () => {
      hunter.player_talk = false
      hunter.currentDialog = hunterAtDoorShort(
        () => {
          hunter.player_talk = false
        })

    }
  )
  hunter.addComponentOrReplace(new Transform(
    {
      position: new Vector3(scene.mansionCenter.x - 25, 0, scene.mansionCenter.z - 3.5),
      rotation: Quaternion.Euler(0, -45, 0),
    }
  ))



  //Evil Ghost 
  ghost = new NPC(
    {
      position: new Vector3(scene.mansionCenter.x, -20, scene.mansionCenter.z),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(4, 4, 4)
    },
    'models/ram_head.glb',
    () => { },
    {
      portrait: { path: 'images/portraits/ghost_boss.png', height: 128, width: 128 },
      reactDistance: 4,
      idleAnim: `stand`,
      faceUser: false,
      onlyExternalTrigger: true
    }
  )

  ghost.onActivate = () => {
    ghost.talk(ghostBossDialog(ghost), 0)
    ghost.playAnimation(`stand`, false)
  }

  ghost.dialog = new DialogWindow(
    { path: 'images/portraits/ghost_boss.png', height: 256, width: 256 },
    true,
    null,
    halloweenTheme
  )
  ghost.dialog.leftClickIcon.positionX = 340 - 60
  ghost.dialog.text.color = Color4.FromHexString('#8DFF34FF')




  //create girl and hide
  const girlIdleTiming: number[] = [4, 5, 2.7]
  girl = new BlendedNPC('models/NPCs/good_girl.glb', 'images/portraits/girl.png', girlIdleTiming)
  girl.addComponentOrReplace(new Transform(
    {
      position: new Vector3(41.70, -10, 38.31),
      rotation: Quaternion.Euler(0, 45, 0)
    }
  ))
  girl.currentDialog = goodGirlDialog(
    () => {
      girl.player_talk = false
      quest.showCheckBox(3)
      setGunUseable()
      girl.currentDialog = goodGirlOutro(() => {
        girl.player_talk = false
        setGunUseable()
      })
      const reward = new Reward(girl, 'w5', { position: new Vector3(0, 1, 1), scale: new Vector3(2, 2, 2) }, true, () => {
        executeTask(async () => {
          if (await updateProgression('w5')) {
              reward.getComponent(Transform).position.y = -4
          }
        })
      })
      reward.spawnSound()
    }
  )

  initDialogsDeps(setGunUseable, enableTunnelGrave, giveGunToPlayer)
  bossInit(ghost, girl, hunter)
  initTeleport(ghost, hunter, firstTimeTrigger)



  engine.addSystem(new BeamGunSystem(ghost))
}

export function hunterAddToEngine(){
  engine.addEntity(hunter)
  engine.addSystem(hunter)
}

export function girlAddToEngine(){
  engine.addEntity(girl)
  engine.addSystem(girl)
}

export async function firstTimeTrigger() {
  setGunUseable()

  turnLeaderIntoGhost()
  spawnGhosts()
  if (await updateProgression('waypoint5')) {
    quest.checkBox(1)
    quest.showCheckBox(2)
  }

  UI.showGhostHealthUI(true)
}