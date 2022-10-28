import { Dialog } from '@dcl/npc-scene-utils'
import { Ghost, ghostState, onBossDead } from "../modules/boss/ghostBoss";
import { ghost, hunter } from "../finalHuntdown";
import * as SOUNDS from "../modules/sounds";
import { setGunUseable } from "../modules/gun";
import { scene } from "../modules/scene";

import { enableTunnelGrave, teleportGrave } from '../modules/allowPlayerIn'
import { giveGunToPlayer } from "../modules/gun";


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
    text: "Oooow Daaaaamn! My rhythms are like bullets!" +
      "F***ck Ooof! My haters... more like lamers!",
    isEndOfDialog: true,
  }

]
export let creepDialog4: Dialog[] = [
  {
    text: "How does my new track sound? I made it just now, I just need to record a Feat. With the Mumbling Ghost." +
      "And then you could give it a listen on all the popular platforms.",

  },
  {
    text: "I must hurry before they notice my absence. We are not allowed to leave." +
      "But laws are not for me. I am a gangster.",
  },
  {
    text: "I live the life of a gangster and write songs about it. I even know what my next track will be about! Escape from the castle!",
  },
  {
    text: "How I hid from the guards, how I went through the portal in the grave ...",
  },
  {
    text: "Have a good one, ichthyander! I am gonna go to Grammy’s!",
    triggeredByNext: () => {
      enableTunnelGrave()
    },
    isEndOfDialog: true,
  }

]

export let creepDialogShort: Dialog[] = [
  {
    text: 'Just look for a dark grave with a cross on its lid and no tombstone. It\'s on the left of the castle!',
    triggeredByNext: () => {
      enableTunnelGrave()
    },
    isEndOfDialog: true,
  }

]
// ghost Control Injured NPC


export let ghostBlasterDialogAtDoor: Dialog[] = [
  {
    text: "Did I already tell that you walk way too slow for someone who is about to beat up a gargoyle?"
  },
  {
    text: "Hopefully you are at least not scared.",
  },
  {
    text: "Getting into the Castle won't be an easy task. Now it isn't Fort Knox, no. But some elbow grease might get involved.",
  },
  {
    text: "I would help, but I need to make sure the perimeter is clear, you know... Gotta watch your six."
  },
  {
    text: "If things get heated – remember, I am behind you.",
  },
  {
    text: "A cipher lock. You'll need to pick a combination to get through it."
  },
  {
    text: "Look around, try to find secret signs around here and pick a combination to work on the lock.",
  },
  {
    text: "Oh, and a weapon might also come in handy...",
  },
  {
    text: `Here, take my spare one!
    It works best in first person mode and you need to hold the trigger once you're inside!`,
  },
  {
    text: "I wandered around here for a little, to get an understanding of the area. And you know...There are many interesting things here. There is even a real Howling Ghost.",
  },
  {
    text: "If you pass by -  try to chat with him, maybe he will tell you something useful. A local resident should know all the loopholes after all.",
  },
  {
    text: `Now go and catch that son of a witch!`,
    triggeredByNext: () => {
      scene.guyToldIntro = true
      giveGunToPlayer()
    },
    isEndOfDialog: true,
  }
]

export let ghostBlasterDialogAtDoorShort: Dialog[] = [

  {
    text: `We have to find a way inside! `,
  },
  {
    text: `If it doesn't work with the lock then try to look around the Castle for secret way! `,
    isEndOfDialog: true,
  },
]

export let ghostBlasterDialogNoWeapon: Dialog[] = [

  {
    text: `You'll need a weapon first, come here! `,
    isEndOfDialog: true,
  },
]

export let ghostBlasterDialogNoClothes: Dialog[] = [

  {
    text: "You’ll need to pick a combination to get through it...",
    isEndOfDialog: true,
  },
]

export let ghostBlasterDialogOutro: Dialog[] = [

  {
    text: 'Amazing job! ...cough ....unbelieveable!',
    triggeredByNext: () => {
      hunter.playAnimation(`Head_Yes`, false)
    },
  },
  {
    text: 'Thank you for your great help on this mission, we would have failed without you!',
    triggeredByNext: () => {
      hunter.playAnimation(`HeadShake_No`, false)
    },
  },
  {
    text: `I have a feeling this won't be the end of it... `,
    triggeredByNext: () => {
      hunter.playAnimation(`Happy Hand Gesture`, false)
    },
  },
  {
    text: `sooo... How would you like a spot on our GhostBlaster team?`,

  },
  {
    text: `We are throwing a huge celebration party later today at Vegas Plaza !\nThink about it and join us there...`,
    triggeredByNext: () => {
      hunter.playAnimation(`Head_Yes`, false)
    },
  },
  {
    text: `You really deserve it! `,
    triggeredByNext: () => {
      setGunUseable()
      scene.guyToldEnding = true
    },
    isEndOfDialog: true,
  },
]
export let ghostBlasterDialogOutroShort: Dialog[] = [

  {
    text: `Truly outstanding job! Think about it and join our team!`,
  },
  {
    text: `You really deserve it! `,
    triggeredByNext: () => {
      setGunUseable()
      scene.guyToldEnding = true
    },
    isEndOfDialog: true,
  },
]



// let playerTrap1 = new PlayerTrap(new Transform({position:scene.trapPosition1}))
// engine.addEntity(playerTrap1)

// Cult Leader NPC
export let goodGirlDialog: Dialog[] = [
  {
    text: `Oh thank you MY HERO!
This monster completely exhausted me with nightmares. 
I no longer had the strength to resist him`,
    triggeredByNext: () => {
    },
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
    triggeredByNext: () => {
      //ghostControlInjured.playAnimation(`HeadShake_No`, true, 1.83)
    },
  },
  {
    text: `Firstly, because we are not in a fairy tale here. 
And secondly, because I have one LITTLE SECRET.
`,
    triggeredByNext: () => {
      //ghostControlInjured.playAnimation(`HeadShake_No`, true, 1.83)
    },
  },
  {
    text: `There is a Nuance.
There is a Trick.

I'M NOT A GIRL.`,
    triggeredByNext: () => {
    }
  },
  {
    text: `I am a ROCK STAR!`,
    triggeredByNext: () => {
    },
  }
]

// Evil Ghost NPC
export let ghostBossDialog: Dialog[] = [
  {
    text: "I have waited for you! And you have stepped right into my trap!",
  },
  {
    text: "You didn’t think you could defeat me so easily did you? Now face the strength of my mighty hands and the sharpness of my dagger claws!",
  },
  {
    text: "I will rip your tongue and make you lick my boots!",
  },
  {
    text: "I will rip that precious smile of yours and make you kiss my rocky-ass!",

  },
  {
    text: `Muaa-Ha-Ha! `,
    triggeredByNext: () => {
      //ghostControlInjured.playAnimation(`Dismissing`, true, 3.3)
      ghost.getComponent(Ghost).state = ghostState.MOVING
      SOUNDS.actionLoopSource.playing = true
      setGunUseable()
    },
    isEndOfDialog: true,
  },

  //on Death
  {
    text: "And when you're done, I'll go to the hipster witches.",
  },
  {
    text: "I'll order them to go to all parts of the world!",
  },
  {
    text: "Unrecognized, they will walk among people dressed up for Halloween and do their hipster deeds!",
  },
  {
    text: "How cunning you are",
  },
  {
    text: "No, I won't make the classic villain's mistake of taunting and boasting of villainous designs for too long to give the hero time to gather his strength!",
  },
  {
    text: "Feel my power!",
    triggeredByNext: async() => {
      //ghostControlInjured.playAnimation(`HeadShake_No`, true, 1.83)
      onBossDead()
    },
    isEndOfDialog: true,
  },

]

