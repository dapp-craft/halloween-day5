import { scene } from "./modules/scene";
import { addBoss } from "./modules/bossCode/ghostBoss";
import { setGunActive, setGunInActive } from "./modules/gun";
import { addNPCs } from "./finalHuntdown";
import { addCreeper } from "./modules/creep";
import { enableTunnelGrave, swapMansion } from "./modules/allowPlayerIn";
import { openMainDoor } from "./modules/mansion";
import { areaEntity } from "./modules/cameraMode";

import {
    checkProgression,
    progression,
    userData, setUserData
} from './halloweenQuests/progression'
import { updateQuestUI } from './halloweenQuests/quest/questTasks'

export function setUpScene() {
    addNPCs()
    addBoss()
    addCreeper()
    scene.isSceneLoaded = true
    engine.addEntity(areaEntity)
    swapMansion('out')
}

function updateSceneByProgression() {
    openMainDoor()
    enableTunnelGrave()
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
        setUpScene()
        updateSceneUI()
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
