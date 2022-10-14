import * as crypto from '@dcl/crypto-scene-utils'
import { IN_PREVIEW } from '../config'

import * as utils from '@dcl/ecs-scene-utils'
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { cultLeader, ghostBlaster } from "../finalHuntdown";
import { gunIsInHand, setGunUseable, setGunUnUseable } from "./gun";
import { scene } from "./scene";
import * as UI from "./ui";
import * as SOUNDS from "./sounds";
import { ghostBlasterDialogNoWeapon, ghostBlasterDialogNoClothes } from '../resources/dialog'
import { mansionInTransform, mansionOutTransform } from './mansion';
import { blocks, upperDoor } from './ghostBoss';



const dressList = [
  "dcl://halloween_2020/hwn_2020_cult_supreme_feet",
  "dcl://halloween_2020/hwn_2020_cult_supreme_helmet",
  "dcl://halloween_2020/hwn_2020_cult_supreme_lower_body",
  "dcl://halloween_2020/hwn_2020_cult_supreme_upper_body",
  "dcl://halloween_2020/hwn_2020_cult_servant_feet",
  "dcl://halloween_2020/hwn_2020_cult_servant_helmet",
  "dcl://halloween_2020/hwn_2020_cult_servant_lower_body",
  "dcl://halloween_2020/hwn_2020_cult_servant_upper_body"


]

//"dcl://moonshot_2020/ms_dcl_upper_body"


// executeTask(async () => {
// 	const allWearables = await wearables.getListOfWearables()
// 	log(allWearables)
// })

export async function checkWearables(): Promise<boolean> {

  //TODO: REMOVE ADDRESS!!!
  let equiped = await crypto.avatar
    .getUserInfo()
    .then(items => {

      log("items: " + items.metadata.avatars[0].avatar.wearables)
      return items.metadata.avatars[0].avatar.wearables

    }).catch((e) => {
      log("error: " + e)
      log("player doesn't own these items")
      return null
    })

  let count = 0

  // if (equiped != null) {
  //   for (let item of equiped) {
  //     for (let allowedItem of dressList) {
  //       if (item === allowedItem) {
  //         count++
  //         log('found ' + count + ' matching wearables! ', item)

  //       }
  //     }
  //   }
  // }

  // if (count > 0) {
  //   return true
  // }

  // log('no cultist clothes found! ')
  // return false
  return true


}

//dcl://base-avatars/eyebrows_00,dcl://base-avatars/mouth_00,dcl://base-avatars/casual_hair_01,dcl://base-avatars/beard,dcl://base-avatars/sneakers,dcl://moonshot_2020/ms_dcl_upper_body,dcl://stay_safe/protection_mask_funny_mask,dcl://dcl_launch/colorful_hat_hat,dcl://base-avatars/aviatorstyle,dcl://base-avatars/comfortablepants,dcl://base-avatars/eyes_09



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

  let hasCultistClothes = await checkWearables()

  if (hasCultistClothes && gunIsInHand) {
    return true
  } else {

    if (!hasCultistClothes && !gunIsInHand) {
      // UI.setCursorMessage("ENTRY DENIED", "CULTISTS ONLY")
      ghostBlaster.talk(ghostBlasterDialogNoClothes, 0, 3)
    }
    else {
      if (!hasCultistClothes) {
        // UI.setCursorMessage("ENTRY DENIED", "CULTISTS ONLY")
        ghostBlaster.talk(ghostBlasterDialogNoClothes, 0, 3)
      }
      if (!gunIsInHand) {
        //UI.setCursorMessage("NOT READY", "YOU NEED A WEAPON")
        ghostBlaster.talk(ghostBlasterDialogNoWeapon, 0, 3)
      }
    }


  }
  return false
}

//create trigger for entity
teleportOutside.addComponent(new utils.TriggerComponent(
  triggerBoxOutside, //shape
  {
    layer: 0,
    onCameraEnter: async () => {
      if (firstTimeEntry) {
        let allowed = await isPlayerAllowedIn()

        if (allowed) {
          swapMansion('in')
          cultLeader.onActivate()
          movePlayerTo(scene.trapPosition1, new Vector3(scene.mansionCenter.x, 1, scene.mansionCenter.z))

          firstTimeEntry = false
          SOUNDS.outsideAmbienceSource.playing = false
          SOUNDS.musicSource.loop = true
          SOUNDS.musicSource.playing = true
        }
      } else {
        setGunUseable()
        swapMansion('in')
        movePlayerTo(scene.teleportArriveInward, new Vector3(scene.mansionCenter.x, 1, scene.mansionCenter.z))
        SOUNDS.outsideAmbienceSource.playing = false
      }
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

      if (gunIsInHand) {
        swapMansion('in')

        if (firstTimeEntry) {
          cultLeader.onActivate()
          movePlayerTo(scene.trapPosition1, new Vector3(scene.mansionCenter.x, 1, scene.mansionCenter.z))
          firstTimeEntry = false
          SOUNDS.outsideAmbienceSource.playing = false


          SOUNDS.musicSource.loop = true
          SOUNDS.musicSource.playing = true

        }
        else {
          setGunUseable()
          movePlayerTo(scene.teleportArriveInward, new Vector3(scene.mansionCenter.x, 1, scene.mansionCenter.z))
          SOUNDS.outsideAmbienceSource.playing = false

        }

      } else {
        //UI.setCursorMessage("NOT READY", "YOU NEED A WEAPON")
        ghostBlaster.talk(ghostBlasterDialogNoWeapon, 0, 4)

      }
    }, {
      button: ActionButton.POINTER,
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
      }
      upperDoor.getComponent(Transform).scale.setAll(1)
      mansionInTransform.scale.setAll(1)
      mansionOutTransform.scale.setAll(0)
      break
    case 'out':
      for (const block of blocks) {
        block.entity.getComponent(Transform).scale.setAll(0)
      }
      upperDoor.getComponent(Transform).scale.setAll(0)
      mansionInTransform.scale.setAll(0)
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