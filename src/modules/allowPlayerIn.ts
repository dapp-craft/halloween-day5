import * as crypto from '@dcl/crypto-scene-utils'

import * as utils from '@dcl/ecs-scene-utils'
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { firstTimeTrigger, ghost, hunter } from "../finalHuntdown";
import { gunIsInHand, setGunUseable, setGunUnUseable } from "./gun";
import { scene } from "./scene";
import * as SOUNDS from "./sounds";
import { ghostBlasterDialogNoWeapon, ghostBlasterDialogNoClothes } from '../resources/dialog'
import { mansionInTransform, mansionOutTransform, openMainDoor, pictureFrame, pictureFrameDummy, rewardDummy } from './mansion';
import { blocks, upperDoor } from './bossCode/ghostBoss';
import { smallGhosts } from './ghostEnemies';



let graveShape = new GLTFShape("models/grave_portal.glb")

const teleportOutside = new Entity()
teleportOutside.addComponent(new BoxShape())
teleportOutside.getComponent(BoxShape).withCollisions = false
teleportOutside.getComponent(BoxShape).visible = false
teleportOutside.addComponent(new Transform({ position: scene.teleportOutsidePos, scale: scene.teleportScale }))


let triggerBoxOutside = new utils.TriggerBoxShape(scene.teleportScale, new Vector3(7, 7, 0))
let triggerBoxInside = new utils.TriggerBoxShape(scene.teleportScale, Vector3.Zero())

let firstTimeEntry = true

//TODO: check wearables/badges here
async function isPlayerAllowedIn(): Promise<boolean> {

  if (gunIsInHand) {
    return true
  } else {
    hunter.talk(ghostBlasterDialogNoWeapon, 0, 3)
    return false
  }

}

async function tryToEnter() {
  if (firstTimeEntry) {
    let allowed = await isPlayerAllowedIn()

    if (allowed) {
      await firstTimeTrigger()


      swapMansion('in')
      movePlayerTo(scene.trapPosition1, new Vector3(scene.mansionCenter.x, 0.8, scene.mansionCenter.z))

      firstTimeEntry = false
      SOUNDS.outsideAmbienceSource.playing = false
      SOUNDS.musicSource.loop = true
      SOUNDS.musicSource.playing = true
    }
  } else {
    setGunUseable()
    swapMansion('in')
    movePlayerTo(scene.teleportArriveInward, new Vector3(scene.mansionCenter.x, 0.8, scene.mansionCenter.z))
    SOUNDS.outsideAmbienceSource.playing = false
  }
}

//create trigger for entity
teleportOutside.addComponent(new utils.TriggerComponent(
  triggerBoxOutside, //shape
  {
    layer: 0,
    onCameraEnter: async () => {
      tryToEnter()
    },
    //enableDebug: true
  }
))

//add entity to engine
engine.addEntity(teleportOutside)


const teleportInside = new Entity()
teleportInside.addComponent(new BoxShape())
teleportInside.getComponent(BoxShape).withCollisions = false
teleportInside.getComponent(BoxShape).visible = false
teleportInside.addComponent(new Transform({ position: scene.teleportInsidePos, scale: scene.teleportScale }))

//create trigger for entity
teleportInside.addComponent(
  new utils.TriggerComponent(
    triggerBoxInside, //shape
    {
      layer: 0,
      onCameraEnter: async () => {
        swapMansion('out')
        movePlayerTo(scene.teleportArriveOutward)
        setGunUnUseable()
        SOUNDS.outsideAmbienceSource.loop = true
        SOUNDS.outsideAmbienceSource.playing = true
      },
      //enableDebug: true
    }
  ))

//add entity to engine
engine.addEntity(teleportInside)




export const teleportGrave = new Entity()
teleportGrave.addComponent(graveShape)
teleportGrave.addComponent(new Transform({ position: scene.teleportGravePos }))
engine.addEntity(teleportGrave)

export function enableTunnelGrave() {

  if (!teleportGrave.hasComponent(OnPointerDown)) {
    teleportGrave.addComponent(new OnPointerDown((e) => {
      tryToEnter()
    }, {
      button: ActionButton.PRIMARY,
      showFeedback: true,
      hoverText: "Use secret tunnel",
      distance: 5
    }))
  }


}

export function swapMansion(state: 'in' | 'out') {
  switch (state) {
    case 'in':
      for (const block of blocks) {
        block.entity.getComponent(Transform).scale.setAll(7.92)
        block.transpEntity.getComponent(Transform).scale.setAll(7.92)
      }
      for (const bat of smallGhosts) {
        bat.getComponent(Transform).scale.setAll(1)
      }
      ghost.getComponent(Transform).scale.setAll(4)
      upperDoor.getComponent(Transform).scale.setAll(1)
      mansionInTransform.scale.setAll(1)
      pictureFrame.getComponent(Transform).scale.setAll(1)
      pictureFrameDummy.getComponent(Transform).scale.setAll(1)
      rewardDummy.getComponent(Transform).scale.setAll(1)

      mansionOutTransform.scale.setAll(0)
      break
    case 'out':
      for (const block of blocks) {
        block.entity.getComponent(Transform).scale.setAll(0)
        block.transpEntity.getComponent(Transform).scale.setAll(0)
      }
      for (const bat of smallGhosts) {
        bat.getComponent(Transform).scale.setAll(0)
      }
      ghost.getComponent(Transform).scale.setAll(0)
      upperDoor.getComponent(Transform).scale.setAll(0)
      mansionInTransform.scale.setAll(0)
      pictureFrame.getComponent(Transform).scale.setAll(0)
      pictureFrameDummy.getComponent(Transform).scale.setAll(0)
      rewardDummy.getComponent(Transform).scale.setAll(0)

      mansionOutTransform.scale.setAll(1)
      break
  }
}


let musicBox = new Entity()
musicBox.addComponent(new Transform({ position: new Vector3(24, 10, 24) }))
musicBox.addComponent(SOUNDS.musicSource)
engine.addEntity(musicBox)

//musicBox.setParent(Attachable.AVATAR)

let outsideAmbience = new Entity()
outsideAmbience.addComponent(SOUNDS.outsideAmbienceSource)
outsideAmbience.addComponent(new Transform({ position: new Vector3(0, 10, 0) }))
engine.addEntity(outsideAmbience)
SOUNDS.outsideAmbienceSource.loop = true
SOUNDS.outsideAmbienceSource.playing = true
outsideAmbience.setParent(Attachable.AVATAR)