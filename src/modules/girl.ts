import * as utils from "@dcl/ecs-scene-utils";
import { NPC, Dialog, NPCState, DialogWindow } from '@dcl/npc-scene-utils'
import { halloweenTheme } from "src/halloweenQuests/quest/questCheckBox";
import { COLOR_GREEN } from "src/resources/theme/color";

enum states {
    idle,
    Standing,
    //Talking_start,
    Talking,
    //Talking_end
}


const IDLE_TIMING: number[] = [5, 2.7, 4.2]
const IDLE_NAMES: string[] = ['idle1', 'idle2', 'idle3']

export class girlNPC extends Entity implements ISystem {

    public currentDialog: Dialog[] = []
    private current_state: states

    public player_talk: boolean

    private animator: Animator
    private idle_index: number = 0

    constructor() {
        super()

        const npc = new NPC(
            {
                position: new Vector3(0, 0, 0),
                scale: new Vector3(0, 0, 0)
            },
            'models/evil_girl.glb',
            () => {
                //this.dialog_start()
                log('acivated')
                npc.talk(this.currentDialog, 0)
                this.player_talk = true
            },
            {
                onWalkAway: () => {
                    this.player_talk = false
                    //if (this.current_state != states.Talking_on && this.current_state != states.Talking_start) return
                    //this.dialog_ends()
                },
                faceUser: false,
                darkUI: false,
                coolDownDuration: 2,
                hoverText: 'CHAT',
                onlyETrigger: false,
                onlyExternalTrigger: false,
                reactDistance: 4,
                continueOnWalkAway: false,
            }
        )
        npc.setParent(this)

        npc.dialog = new DialogWindow({ path: 'images/portraits/girl.png', height: 256, width: 256 }, true, null, halloweenTheme)
        npc.dialog.leftClickIcon.positionX = 340 - 60
        npc.dialog.text.color = Color4.FromHexString(COLOR_GREEN)


        this.addComponentOrReplace(new GLTFShape('models/evil_girl.glb'))

        const _animator = new Animator()
        _animator.addClip(new AnimationState('stand', { layer: 0, looping: true, weight: 1 }))
        _animator.addClip(new AnimationState('talk', { layer: 1, looping: true, weight: 0 }))
        _animator.addClip(new AnimationState('idle1', { layer: 2, looping: false, weight: 0 }))
        _animator.addClip(new AnimationState('idle2', { layer: 2, looping: false, weight: 0 }))
        _animator.addClip(new AnimationState('idle3', { layer: 2, looping: false, weight: 0 }))
        _animator.getClip('stand').play(true)
        _animator.getClip('talk').play(true)
        _animator.getClip('idle1').play(true)
        _animator.getClip('idle2').play(true)
        _animator.getClip('idle3').play(true)

        this.addComponent(_animator)
        this.animator = _animator

        this.player_talk = false
        this.current_state = states.Standing
    }

    private timer: number = 0
    update(dt: number): void {
        this.timer += dt
        const value = dt * 1.5
        switch (this.current_state) {

            case states.Standing:

                if (this.player_talk) {
                    this.timer = 0
                    this.current_state = states.Talking
                } else if (this.timer >= 6) {
                    this.timer = 0
                    this.current_state = states.idle
                    this.generateIndex()
                    this.animator.getClip(IDLE_NAMES[this.idle_index]).play(true)
                } else {
                    this.addWeight(this.animator.getClip('stand'), value)
                    this.removeWeight(this.animator.getClip('talk'), value)
                    this.removeWeight(this.animator.getClip(IDLE_NAMES[this.idle_index]), value)
                }

                break;

            case states.idle:

                if (this.timer >= IDLE_TIMING[this.idle_index]) {
                    this.timer = 0
                    this.current_state = states.Standing
                } else if (this.player_talk) {
                    this.timer = 0
                    this.current_state = states.Talking
                } else {
                    this.removeWeight(this.animator.getClip('stand'), value)
                    this.removeWeight(this.animator.getClip('talk'), value)
                    this.addWeight(this.animator.getClip(IDLE_NAMES[this.idle_index]), value)
                }

                break;

            case states.Talking:

                if (!this.player_talk) {
                    this.timer = 0
                    this.current_state = states.Standing
                } else {
                    this.removeWeight(this.animator.getClip('stand'), value)
                    this.addWeight(this.animator.getClip('talk'), value)
                    this.removeWeight(this.animator.getClip(IDLE_NAMES[this.idle_index]), value)
                }

                break;
        }
    }


    // public dialog_start() {
    //     this.playAnimation('talk_start', true)
    //     this.current_state = states.Talking_start
    //     utils.setTimeout(
    //         1166,
    //         () => {
    //             if (this.current_state != states.Talking_start) return
    //             this.current_state = states.Talking_on
    //             this.playAnimation('talk', false)
    //             this.talk(this.currentDialog, 0)
    //         }
    //     )
    // }

    // public dialog_ends() {
    //     this.endInteraction()
    //     this.current_state = states.Talking_end
    //     this.playAnimation('talk_end', true)
    //     utils.setTimeout(
    //         700,
    //         () => {
    //             this.current_state = states.Standing
    //             this.playAnimation('stand', false)
    //         }
    //     )
    // }

    private generateIndex(): number {

        let index = Math.floor(Math.random() * IDLE_NAMES.length)
        if (index == this.idle_index) {
            return this.generateIndex()
        }

        this.idle_index = index
        return index
    }

    private removeWeight(animation: AnimationState, value: number) {
        if (animation.weight <= 0) animation.weight = 0
        else animation.weight -= value
    }

    private addWeight(animation: AnimationState, value: number) {
        if (animation.weight >= 1) animation.weight = 1
        else animation.weight += value
    }

}