import { Dialog } from '@dcl/npc-scene-utils'
import * as SOUNDS from "../modules/sounds";
import { scene } from "../modules/scene";
import { Ghost, ghostState, onBossDeadExec } from "../modules/bossCode/ghostDef";

let setGunUseable
let enableTunnelGrave
let giveGunToPlayer

export function initDialogsDeps(setGunUseable_, enableTunnelGrave_, giveGunToPlayer_) {
  setGunUseable = setGunUseable_
  enableTunnelGrave = enableTunnelGrave_
  giveGunToPlayer = giveGunToPlayer_
}


//creeper NPC
export let creepDialog1: Dialog[] = [
  {
    text: 'Ooooh! Wo-oh-oh! My sorrow is as great as the ocean!',
    isEndOfDialog: true,
  }

]
export let creepDialog2: Dialog[] = [
  {
    text: 'Ooooh! Wo-oh-oh! My sadness is as heavy as the mountains!',
    isEndOfDialog: true,
  }

]
export let creepDialog3: Dialog[] = [
  {
    text: `Oooow Daaaaamn! My rhythms are like bullets!
F***ck Ooof! My haters... more like lamers!`,
  },
  {
    text: `How does my new track sound? I made it just now, I just need to record a Feat. With the Mumbling Ghost.
And then you could give it a listen on all the popular platforms.`,

  },
  {
    text: `I must hurry before they notice my absence. We are not allowed to leave.
But laws are not for me. I am a gangster.`,
  },
  {
    text: `I live the life of a gangster and write songs about it. I even know what my next track will be about! Escape from the castle!`,
  },
  {
    text: `How I hid from the guards, how I went through the PORTAL in the GRAVE ...`,
  },
  {
    text: `Have a good one, ichthyander! I am gonna go to Grammy’s!`,
    triggeredByNext: () => {
      enableTunnelGrave()
    },
    isEndOfDialog: true,
  }

]

export let creepDialogShort: Dialog[] = [
  {
    text: `Just LOOK FOR a dark GRAVE with a CROSS on its lid and no tombstone. It\'s on the LEFT OF THE CASTLE!`,
    triggeredByNext: () => {
      enableTunnelGrave()
    },
    isEndOfDialog: true,
  }

]

export function hunterAtDoor(callback: () => void): Dialog[] {
  return [
    {
      text: `Did I already tell that you walk way too slow for someone who is about to BAET UP a GARGOYLE?`
    },
    {
      text: `Hopefully you are at least not scared.`,
    },
    {
      text: `Getting INTO the CASTLE won't be an easy task. Now it isn't Fort Knox, no. But some elbow grease might get involved.`,
    },
    {
      text: `I would help, but I need to make sure the perimeter is clear, you know... Gotta watch your six.`
    },
    {
      text: `If things get heated – remember, I am behind you.`,
    },
    {
      text: `A cipher lock. You'll need to pick a combination to get through it.`
    },
    {
      text: `Look around, try to find SECRET SIGNS around here and PICK a COMBINATION to work on the lock.`,
    },
    {
      text: `Oh, and a WEAPON might also come in handy...`,
    },
    {
      text: `Here, take my spare one!
It works best in FIRST PERSON MODE and you need to hold the trigger once you're inside!`,
    },
    {
      text: `I wandered around here for a little, to get an understanding of the area. And you know...There are many interesting things here. There is even a real Howling Ghost.`,
    },
    {
      text: `If you pass by -  try to chat with him, maybe he will tell you something useful. A local resident should know all the loopholes after all.`,
    },
    {
      text: `Now go and CATCH that SON OF A WITCH!`,
      triggeredByNext: () => {
        scene.guyToldIntro = true
        giveGunToPlayer()
        callback()
      },
      isEndOfDialog: true,
    }
  ]
}


export function hunterAtDoorShort(callback: () => void): Dialog[] {
  return [
    {
      text: `We have to find a way inside! `,
    },
    {
      text: `If it doesn't work with the lock then try to look AROUND the CASTLE for SECRET WAY! `,
      triggeredByNext: () => {
        callback()
      },
      isEndOfDialog: true,
    },
  ]
}

export function hunterNoWeapon(callback: () => void): Dialog[] {
  return [
    {
      text: `You'll need a weapon first, come here! `,
      triggeredByNext: () => {
        callback()
      },
      isEndOfDialog: true,
    },
  ]
}


export function hunterAfterBossDeath(callback: () => void): Dialog[] {
  return [
    {
      text: `Wanna enter Castle again?`,
    },
    {
      text: `Looks like there is nothing left.
But I feel we can miss something.`,
    },
    {
      text: `Take gun for sure.`,
      triggeredByNext: () => {
        giveGunToPlayer()
        callback()
      },
      isEndOfDialog: true,
    },
  ]
}
export function hunterAfterBossDeathShort(callback: () => void): Dialog[] {
  return [
    {
      text: `Find anything interesting?`,
    },
    {
      text: `I bet you are!`,
      triggeredByNext: () => {
        callback()
      },
      isEndOfDialog: true,
    },
  ]
}


// girl NPC
export function goodGirlDialog(callback: () => void) {
  const dialog: Dialog[] = [
    {
      text: `Oh thank you MY HERO!
This monster completely exhausted me with nightmares. 
I no longer had the strength to resist him`,
    },
    {
      text: `Never, dear player, never let anyone treat you like that. 
Fight to the end because, most likely, 
there won't be a hero for you who will come to your rescue.` ,
    },
    {
      text: `And I'm lucky!
You are my hero and there I am, your princess, right in this castle.`,
    },
    {
      text: `Only we can not be together, 
as it happens in fairy tales. 
Sorry. `,
    },
    {
      text: `Firstly, because we are not in a fairy tale here. 
And secondly, because I have one LITTLE SECRET.
`,
    },
    {
      text: `There is a Nuance.
There is a Trick.

I'M NOT A GIRL.`,
    },
    {
      text: `I am a ROCK STAR!`,
      triggeredByNext: () => {
        callback()
      },
      isEndOfDialog: true
    },

  ]
  return dialog
}

export function goodGirlOutro(callback: () => void) {
  const dialog: Dialog[] = [
    {
      text: `See you at GLASS PAVILLION`,
    },
    {
      text: `Rock Star is waiting for you at `,
      triggeredByNext: () => {
        callback()
      },
      isEndOfDialog: true
    },
  ]

  return dialog
}


// Evil Garg NPC
export function ghostBossDialog(g): Dialog[] {
  return [
    {
      text: `I have waited for you! And you have stepped right into my trap!`,
    },
    {
      text: `You didn’t think you could defeat me so easily did you? Now face the strength of my mighty hands and the sharpness of my dagger claws!`,
    },
    {
      text: `I will rip your tongue and make you lick my boots!`,
    },
    {
      text: `I will rip that precious smile of yours and make you kiss my rocky-ass!`,

    },
    {
      text: `Muaa-Ha-Ha! `,
      triggeredByNext: () => {
        //ghostControlInjured.playAnimation(`Dismissing`, true, 3.3)
        g.getComponent(Ghost).state = ghostState.MOVING
        SOUNDS.actionLoopSource.playing = true
        setGunUseable()
      },
      isEndOfDialog: true,
    },

  ]
}
export function ghostDeathDialog(): Dialog[] {
  return [
    //on Death
    {
      text: `And when you're done, I'll go to the hipster witches.`,
    },
    {
      text: `I'll order them to go to all parts of the world!`,
    },
    {
      text: `Unrecognized, they will walk among people dressed up for Halloween and do their hipster deeds!`,
    },
    {
      text: `How cunning you are`,
    },
    {
      text: `No, I won't make the classic villain's mistake of taunting and boasting of villainous designs for too long to give the hero time to gather his strength!`,
    },
    {
      text: `Feel my power!`,
      triggeredByNext: async () => {
        //ghostControlInjured.playAnimation(`HeadShake_No`, true, 1.83)
        onBossDeadExec()
      },
      isEndOfDialog: true,
    }
  ]
}

