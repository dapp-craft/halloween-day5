import { scene } from "./modules/scene";
import { addBoss, upperDoor } from "./modules/bossCode/ghostBoss";
import { giveGunToPlayer, setGunActive, setGunInActive } from "./modules/gun";
import { createNPCs, girlAddToEngine, hunter, hunterAddToEngine } from "./finalHuntdown";
import { addCreeper } from "./modules/creep";
import { enableTunnelGrave, setFirstTimeEntryFalse, swapMansion } from "./modules/allowPlayerIn";
import { createPadlock, openMainDoor, spawnPicture } from "./modules/mansion";
import { areaEntity } from "./modules/cameraMode";

import {
    checkProgression,
    progression,
    userData, setUserData, updateProgression
} from './halloweenQuests/progression'
import { quest, updateQuestUI } from './halloweenQuests/quest/questTasks'
import { hunterAfterBossDeath, hunterAfterBossDeathShort, hunterAtDoorShort } from "./resources/dialog";
import { Reward } from "./halloweenQuests/loot";

export function setUpScene() {
    createNPCs()
    addBoss()
    scene.isSceneLoaded = true
    engine.addEntity(areaEntity)
    swapMansion('out')
}

function updateSceneByProgression() {
    log('UPDATE')
    if (
        quest.isChecked(0) &&
        progression.data.w1Found &&
        progression.data.w2Found &&
        progression.data.w3Found &&
        progression.data.w4Found &&
        progression.day > 4
    ) {
        log('ITS TIME')
        createPadlock()
        girlAddToEngine()
        hunterAddToEngine()

        if (progression.data.ghostDefeated) {
            log('DEFEATED')
            setFirstTimeEntryFalse()
            upperDoor.removeComponent(OnPointerDown)
            openMainDoor()
            enableTunnelGrave()
            spawnPicture() 
            hunter.currentDialog = hunterAfterBossDeath(
                () => {
                    hunter.currentDialog = hunterAfterBossDeathShort(
                        () => {
                            hunter.player_talk = false
                        })
                    hunter.player_talk = false
                })
                
                if(!progression.data.w5Found){
                    const rewardDummy = new Entity()
                    rewardDummy.addComponentOrReplace(new Transform({position: scene.mansionCenter}))
                    engine.addEntity(rewardDummy)
                    const reward = new Reward(rewardDummy, 'w5', { position: new Vector3(0, 1, 0), scale: new Vector3(2, 2, 2) }, true, () => {
                        executeTask(async () => {
                          if (await updateProgression('w5')) {
                            progression.data['w5'] = true
                            progression.progressionChanged = true
                          }
                          reward.getComponent(Transform).position.y = -4
                        })
                      })
                }

        } else if (progression.data.waypoint5) {
            giveGunToPlayer()
            openMainDoor()
            enableTunnelGrave()

            hunter.currentDialog = hunterAtDoorShort(
                () => {
                    hunter.player_talk = false
                })

        } else {
            addCreeper()
        }


    }

}

let updating = false
function updateSceneUI() {
    return executeTask(async () => {
        let result = false
        if (!updating) {
            try {
                updating = true
                const curr_progression = await checkProgression()
                log('checkProgression', curr_progression, progression)
                if (curr_progression != null) {
                    // curr_progression.data['w1Found'] = true
                    // curr_progression.data['w2Found'] = true
                    // curr_progression.data['w3Found'] = true
                    // curr_progression.data['w4Found'] = true
                    // curr_progression.data['NPCIntroDay5'] = true
                    // curr_progression.data['waypoint5'] = true
                    // curr_progression.data['ghostDefeated'] = true
        
      
                    // if (progression.data != null && isEqual(progression.data, curr_progression.data)) {
                    //     log('no changes')
                    //     result = true
                    // } else {
                    progression.data = curr_progression.data
                    progression.day = curr_progression.day

                    if (progression.data != null) {
                        log('updateQuestUI', progression.day, progression.data)
                        updateQuestUI(progression.data, progression.day)

                        updateSceneByProgression()
                        result = true
                    } else {
                        log('progression problem', progression.data)
                    }
                    // }
                }
            } catch (e) {
                log('updating error', e)
            }
        } else {
            log('last updating not complete')
        }
        log('updating end', updating, result)
        updating = false
        log('updating', updating, result)
        if (result) {
            progression.progressionChanged = false
        }
        return result
    })
}

onEnterSceneObservable.add((player) => {
    log('player entered scene: ', player.userId)
    executeTask(async () => {
        if (!userData) {
            await setUserData()
        }

        if (userData.userId == player.userId) {
            updateSceneUI()
        }
    })
})

onSceneReadyObservable.add(() => {
    log('onSceneReadyObservable')
    executeTask(async () => {
        updateSceneUI()
        setUpScene()
    })
})

//mouse input
const input = Input.instance
input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, e => {
    // log("pointer POINTER Down", e)  
    setGunActive()
})

input.subscribe("BUTTON_UP", ActionButton.POINTER, false, e => {
    //log("pointer POINTER UP", e)  
    setGunInActive()
})
