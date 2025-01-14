@Component('org.decentraland.PadLockPirate')
export class PadLockComponent {
  combination: number = 11111
  onSolve: Actions

  wheel1: Entity
  wheel2: Entity
  wheel3: Entity
  wheel4: Entity
  wheel5: Entity
  
  digit1: number
  digit2: number
  digit3: number
  digit4: number
  digit5: number

  constructor(
    public channel: IChannel,
    combination: number,
    onSolve: Actions,
    wheel1: Entity,
    wheel2: Entity,
    wheel3: Entity,
    wheel4: Entity,
    wheel5: Entity,

    digit1: number,
    digit2: number,
    digit3: number,
    digit4: number,
    digit5: number
  ) {
    this.combination = combination
    this.onSolve = onSolve
    this.wheel1 = wheel1
    this.wheel2 = wheel2
    this.wheel3 = wheel3
    this.wheel4 = wheel4
    this.wheel5 = wheel5

    this.digit1 = digit1
    this.digit2 = digit2
    this.digit3 = digit3
    this.digit4 = digit4
    this.digit5 = digit5
  }
}
