import { padlock_models } from 'src/resources/model_paths'
import { PadLockComponent } from './padlock'

export type Props = {
    onSolve: Actions
    combination: number
}

export default class PadLock implements IScript<Props> {
    spinClip = new AudioClip('sounds/padlock/Button_Press.mp3')
    solveClip = new AudioClip('sounds/padlock/Resolve.mp3')
    padLockEntity: Entity
    callbackOnCoplete: () => void

    massiveCombination: number[] = []

    constructor(_callbackOnComplete: () => void) {
        this.callbackOnCoplete = _callbackOnComplete
    }

    init() { }

    scrambleWheels(entity: Entity) {
        let wheels = entity.getComponent(PadLockComponent)

        wheels.digit1 = Math.floor(Math.random() * 10)
        wheels.digit2 = Math.floor(Math.random() * 10)
        wheels.digit3 = Math.floor(Math.random() * 10)
        wheels.digit4 = Math.floor(Math.random() * 10)
        wheels.digit5 = Math.floor(Math.random() * 10)

        this.rotateWheels(entity)
    }

    public isOpen(): boolean {
        let wheels = this.padLockEntity.getComponent(PadLockComponent)

        let nums: number[] = [
            wheels.digit1,
            wheels.digit2,
            wheels.digit3,
            wheels.digit4,
            wheels.digit5,
        ]
        nums.sort()

        const result =
            nums[0] * 10000 +
            nums[1] * 1000 +
            nums[2] * 100 +
            nums[3] * 10 +
            nums[4]


        log('curr ' + result)
        log('true ' + wheels.combination)
        return result === wheels.combination
    }

    public SetOpen(): void {
        let wheels = this.padLockEntity.getComponent(PadLockComponent)

        let code = '' + wheels.combination
        wheels.digit1 = +code[0]
        wheels.digit2 = +code[1]
        wheels.digit3 = +code[2]
        wheels.digit4 = +code[3]
        wheels.digit5 = +code[4]
        this.rotateWheels(this.padLockEntity)
    }

    rotateWheels(entity: Entity) {
        let wheels = entity.getComponent(PadLockComponent)

        wheels.wheel1.getComponent(Transform).rotation = Quaternion.Euler(
            (wheels.digit1 - 1) * 36,
            0,
            0
        )
        wheels.wheel2.getComponent(Transform).rotation = Quaternion.Euler(
            (wheels.digit2 - 1) * 36,
            0,
            0
        )
        wheels.wheel3.getComponent(Transform).rotation = Quaternion.Euler(
            (wheels.digit3 - 1) * 36,
            0,
            0
        )
        wheels.wheel4.getComponent(Transform).rotation = Quaternion.Euler(
            (wheels.digit4 - 1) * 36,
            0,
            0
        )
        wheels.wheel5.getComponent(Transform).rotation = Quaternion.Euler(
            (wheels.digit5 - 1) * 36,
            0,
            0
        )


        if (this.isOpen()) {
            log('GOT IT RIGHT!')
            const clip = this.solveClip
            const source = new AudioSource(clip)
            source.volume = 1
            entity.addComponentOrReplace(source)
            source.playOnce()
            // wheels.channel.sendActions(wheels.onSolve)

            this.callbackOnCoplete()
        } else {
            const clip = this.spinClip
            const source = new AudioSource(clip)
            source.volume = 0.3
            entity.addComponentOrReplace(source)
            source.playOnce()
        }
    }

    spawn(host: Entity, props: Props, channel: IChannel) {
        this.padLockEntity = new Entity()
        this.padLockEntity.setParent(host)
        this.padLockEntity.addComponent(
            new Transform({
                position: new Vector3(0, 0, 0),
                scale: new Vector3(1, 1, 1)
            })
        )
        this.padLockEntity.addComponent(new GLTFShape(padlock_models.base))

        const wheel1 = new Entity()
        const wheel2 = new Entity()
        const wheel3 = new Entity()
        const wheel4 = new Entity()
        const wheel5 = new Entity()

        let lockProperties = new PadLockComponent(
            channel,
            props.combination,
            props.onSolve,
            wheel1,
            wheel2,
            wheel3,
            wheel4,
            wheel5,

            0, 0, 0, 0, 0
        )

        this.padLockEntity.addComponent(lockProperties)

        wheel1.setParent(host)
        wheel1.addComponent(
            new Transform({
                rotation: Quaternion.Euler(0, 0, 0),
                position: new Vector3(0.14, 0, 0)
            })
        )
        wheel1.addComponent(new GLTFShape(padlock_models.wheel1))

        wheel1.addComponent(
            new OnPointerDown(
                e => {
                    lockProperties.digit1 = (lockProperties.digit1 + 1) % 10
                    this.rotateWheels(this.padLockEntity)

                },
                {
                    button: ActionButton.POINTER,
                    hoverText: 'Spin',
                    distance: 4
                }
            )
        )

        wheel2.setParent(host)
        wheel2.addComponent(
            new Transform({
                rotation: Quaternion.Euler(0, 0, 0),
                position: new Vector3(0.03, 0, 0)
            })
        )
        wheel2.addComponent(new GLTFShape(padlock_models.wheel2))
        wheel2.addComponent(
            new OnPointerDown(
                e => {

                    lockProperties.digit2 = (lockProperties.digit2 + 1) % 10
                    this.rotateWheels(this.padLockEntity)
                },
                {
                    button: ActionButton.POINTER,
                    hoverText: 'Spin',
                    distance: 4
                }
            )
        )

        wheel3.setParent(host)
        wheel3.addComponent(
            new Transform({
                rotation: Quaternion.Euler(0, 0, 0),
                position: new Vector3(-0.08, 0, 0)
            })
        )
        wheel3.addComponent(new GLTFShape(padlock_models.wheel3))
        wheel3.addComponent(
            new OnPointerDown(
                e => {

                    lockProperties.digit3 = (lockProperties.digit3 + 1) % 10
                    this.rotateWheels(this.padLockEntity)
                },
                {
                    button: ActionButton.POINTER,
                    hoverText: 'Spin',
                    distance: 4
                }
            )
        )

        wheel4.setParent(host)
        wheel4.addComponent(
            new Transform({
                rotation: Quaternion.Euler(0, 0, 0),
                position: new Vector3(-0.18, 0, 0)
            })
        )
        wheel4.addComponent(new GLTFShape(padlock_models.wheel4))
        wheel4.addComponent(
            new OnPointerDown(
                e => {
                    lockProperties.digit4 = (lockProperties.digit4 + 1) % 10
                    this.rotateWheels(this.padLockEntity)
                },
                {
                    button: ActionButton.POINTER,
                    hoverText: 'Spin',
                    distance: 4
                }
            )
        )

        wheel5.setParent(host)
        wheel5.addComponent(
            new Transform({
                rotation: Quaternion.Euler(0, 0, 0),
                position: new Vector3(-0.29, 0, 0)
            })
        )
        wheel5.addComponent(new GLTFShape(padlock_models.wheel5))
        wheel5.addComponent(
            new OnPointerDown(
                e => {
                    lockProperties.digit5 = (lockProperties.digit5 + 1) % 10
                    this.rotateWheels(this.padLockEntity)
                },
                {
                    button: ActionButton.POINTER,
                    hoverText: 'Spin',
                    distance: 4
                }
            )
        )

        this.scrambleWheels(this.padLockEntity)

        // handle actions
        channel.handleAction('scramble', () => {
            this.scrambleWheels(this.padLockEntity)
        })

        // sync initial values
        channel.request<number[]>('value', ([digit1, digit2, digit3, digit4, digit5]) => {
            lockProperties.digit1 = digit1
            lockProperties.digit2 = digit2
            lockProperties.digit3 = digit3
            lockProperties.digit4 = digit4
            lockProperties.digit5 = digit5
            this.rotateWheels(this.padLockEntity)
        })
        channel.reply<number[]>('value', () => {
            const { digit1, digit2, digit3, digit4, digit5 } = this.padLockEntity.getComponent(
                PadLockComponent
            )
            return [digit1, digit2, digit3, digit4, digit5]
        })

        const combination = this.padLockEntity.getComponent(PadLockComponent).combination
        let num1 = Math.floor(combination / 10000)
        this.massiveCombination.push(num1)
        let num2 = Math.floor((combination % 10000) / 1000)
        this.massiveCombination.push(num2)
        let num3 = Math.floor((combination % 1000) / 100)
        this.massiveCombination.push(num3)
        let num4 = Math.floor((combination % 100) / 10)
        this.massiveCombination.push(num4)
        let num5 = combination % 10
        this.massiveCombination.push(num5)
        this.massiveCombination.sort()
        //log('massive are: '+this.massiveCombination)

        this.padLockEntity.getComponent(PadLockComponent).combination = this.massiveCombination[0] * 10000
            + this.massiveCombination[1] * 1000
            + this.massiveCombination[2] * 100
            + this.massiveCombination[3] * 10
            + this.massiveCombination[4]

    }

    public Hide(): void {
        this.SetOpen()
    }
}
