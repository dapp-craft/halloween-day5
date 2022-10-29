import {setGunInActive} from "../gun";
import {scene} from "../scene";

export enum ghostState {
    MOVING = 0,
    ANTICIPATING = 1,
    ATTACKING = 2,
    DIZZY = 3,
    WAITING = 4,
    TALKING = 5,
    DEATH = 6,
    DEAD = 7,
    APPEAR = 8,
    HIDDEN = 9
}

@Component("Ghost")
export class Ghost {
    health: number = 100
    state: ghostState = ghostState.HIDDEN
    healthRegenRate: number = 1
}

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

let onBossDead

export function addOnBossDead(onBossDead_) {
    log('addOnBossDead', onBossDead_)
    onBossDead = onBossDead_
}

export function onBossDeadExec() {
    log('onBossDead',onBossDead.toString())
    return onBossDead()
}