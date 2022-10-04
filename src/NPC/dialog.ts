import { Dialog } from '@dcl/npc-scene-utils'
import * as UI from '../modules/ui'
import { Ghost, ghostState, onBossDead, turnLeaderIntoGhost } from "../modules/ghostBoss";
import {  cultLeader, ghost, farmer, girlCult, catLover, ghostBlaster, cultist1  } from "../finalHuntdown";
import * as SOUNDS from "../modules/sounds";
import { setGunUseable } from "../modules/gun";
import { spawnGhosts  } from "../modules/ghostEnemies";
import { PlayerTrap } from "../modules/trap";
import { scene } from "../modules/scene";

import { enableTunnelGrave, teleportGrave } from '../../src/modules/allowPlayerIn'
import { giveGunToPlayer } from "../modules/gun";


//creeper NPC
export let creepDialog1: Dialog[] = [
  {
    text: 'You\'re never gonna catch meeeeeee.... ',
    isEndOfDialog: true,
  }    
  
]
export let creepDialog2: Dialog[] = [
  {
    text: 'I know something, you know nothing... ',
    isEndOfDialog: true,
  }    
  
]
export let creepDialog3: Dialog[] = [
  {
    text: 'OK now leave me alone will ya?',
    isEndOfDialog: true,
  }    
  
]
export let creepDialog4: Dialog[] = [
  {
    text: 'All right, all right. You got me.', 
       
  },
  {
    text: 'You\'re just too desperate to get inside a deathly cult mansion, aren\'t you?',    
  },  
  {
    text: 'Well... All you need to do is use the secret tunnel! Ya haaa!',    
  },  
  {
    text: 'Just look for a dark grave with a cross on its lid and no tombstone. It\'s on the left of the mansion!',
    triggeredByNext: () => {
      enableTunnelGrave()
    },
    isEndOfDialog: true,
  }  
  
]

export let creepDialogShort: Dialog[] = [
  {
    text: 'Just look for a dark grave with a cross on its lid and no tombstone. It\'s on the left of the mansion!',
    triggeredByNext: () => {
      enableTunnelGrave()
    },
    isEndOfDialog: true,
  }    
  
]
// ghost Control Injured NPC

export let ghostBlasterDialogAtPlaza: Dialog[] = [
  {
    text: 'Looking for the old lady, huh?',
  },  
  {
    text: 'Well guess what? She turned out to be the long time suspect of our GhostBlaster team and thanks to your investigation we\'ve been able to track down her secret hideout mansion',
  },  
  {
    text: 'She leads an evil cult that\'s trying to channel demons into Decentraland',
  },  
  {
    text: 'Now that she\'s been busted, she has probaly started to open the portal already!',
  },  
  {
    text: 'I\'m heading there now to stop her. If you\'re interested in helping me putting an end to this once and for all...',
  },  
  {
    text: ` ...meet me at the Cult Mansion! `,
    triggeredByNext: () => {          
      
    },
    isEndOfDialog: true,
  }
]

export let ghostBlasterDialogAtDoor: Dialog[] = [
  {
    text: 'Hey! ...cough ...cough ... So glad you came!',
    triggeredByNext: () => {
      ghostBlaster.playAnimation(`HeadShake_No`, false)
    }, 
  },
  {
    text: 'I managed to open the door, but the mansion seems to be defended by some sort of cultist dress-code magic',
    triggeredByNext: () => {
      ghostBlaster.playAnimation(`Happy Hand Gesture`, false)
    },
    
  },
  {
    text: `If you have that cultist uniform with you... It would save a lot of time...`,
    triggeredByNext: () => {
      ghostBlaster.playAnimation(`Tought Head Shake`, false)
    },
    
    
  },
  {
    text: `Otherwise, you'll just have to find and alternative entrance into the mansion!`,
    triggeredByNext: () => {
      ghostBlaster.playAnimation(`Lengthy`, false)
    },
  },
  {
    text: `Oh, and a weapon might also come in handy... `,
    triggeredByNext: () => {
      ghostBlaster.playAnimation(`Happy Hand Gesture`, false)
      giveGunToPlayer()
    },
    
  },
  {
    text: `Here, take my spare one! \nIt works best in first person mode (Press V) and you need to hold the trigger once you're inside!`,  
    triggeredByNext: () => {
      ghostBlaster.playAnimation(`Hard Head`, true, 2)
      
    },  
  },
  {
    text: `Now go and catch that son of a witch!`,
    triggeredByNext: () => {          
      scene.guyToldIntro = true
    },
    isEndOfDialog: true,
  }
]

export let ghostBlasterDialogAtDoorShort: Dialog[] = [

  {
   text: `We have to find a way inside! `,    
 },
 {
   text: `If you don't have cultist clothes then try to look around the mansion! `,  
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
   text: `It seems to only let through cultists...`, 
   isEndOfDialog: true,   
 },
]

export let ghostBlasterDialogOutro: Dialog[] = [

  {
    text: 'Amazing job! ...cough ....unbelieveable!',
    triggeredByNext: () => {
      ghostBlaster.playAnimation(`Head_Yes`, false)
    },    
  },
  {
    text: 'Thank you for your great help on this mission, we would have failed without you!',
    triggeredByNext: () => {
      ghostBlaster.playAnimation(`HeadShake_No`, false)
    },
  },
  {
    text: `I have a feeling this won't be the end of it... `,
    triggeredByNext: () => {
      ghostBlaster.playAnimation(`Happy Hand Gesture`, false)
    },     
  },
  {
    text: `sooo... How would you like a spot on our GhostBlaster team?`,  
    
  },
  {
    text: `We are throwing a huge celebration party later today at Vegas Plaza !\nThink about it and join us there...`, 
    triggeredByNext: () => {
      ghostBlaster.playAnimation(`Head_Yes`, false)
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



let playerTrap1 = new PlayerTrap(new Transform({position:scene.trapPosition1}))
engine.addEntity(playerTrap1)

// Cult Leader NPC
export let cultLeaderDialog: Dialog[] = [
  {
    text: 'Welcome to the club Fool! See some familiar faces?',
    triggeredByNext: () => {
      cultLeader.playAnimation(`Cocky_Armature`, true, 1.83)      
    },    
  },
  {
    text: 'MWAHAHAHAHAHAHAHAHHAHA',
  },
  {
    text: 'You still think you got here by your clever investigation don\'t you?',
  },
  {
    text: `That poor girl had to die for the same reasons you were lead here today. `,
    triggeredByNext: () => {
      //ghostControlInjured.playAnimation(`HeadShake_No`, true, 1.83)
    },
  },
  {
    text: `Forces, bigger than your mortal mind could ever imagine are being set loose as we speak. `,
    triggeredByNext: () => {
      //ghostControlInjured.playAnimation(`HeadShake_No`, true, 1.83)
    },
  },
  {
    text: `The ritual is almost complete and I won't let you stop that! \n\nBut otherwise, feel yourself at home!`,
    triggeredByNext: () => {
      cultLeader.playAnimation(`Cocky_Armature`, true, 1.83)
    }
  },
  {
    text: `MWAHAHAHAHAHAHAHAHHAHA `,
    triggeredByNext: () => {
      //ghostControlInjured.playAnimation(`Dismissing`, true, 3.3)      
     // setGunUseable()     
    },    
  },
  {
    text: 'Oh, you have the gun? Hmm... nice touch.',      
  },  
  {
    text: 'Okay, so that\'s how you want to play this...',
  },
  {
    text: '[To Servants:]\n\nHOLD UP THIS ONE AS LONG AS POSSIBLE! ',
    triggeredByNext: () => {
      //ghostControlInjured.playAnimation(`HeadShake_No`, true, 1.83)
      setGunUseable()
      
      turnLeaderIntoGhost()
      engine.removeEntity(catLover)
      engine.removeEntity(farmer)
      engine.removeEntity(girlCult)
      engine.removeEntity(cultist1)      
      spawnGhosts()     
     
      
      playerTrap1.hide()
      UI.showGhostHealthUI(true)     

    },
    isEndOfDialog: true,
  },  
]

// Evil Ghost NPC
export let ghostBossDialog: Dialog[] = [
  {
    text: 'AH! It\'s you... AGAIN!', 
    triggeredByNext: () => {
      ghost.playAnimation(`Idle_003`, true, 3)
    },   
  },
  {
    text: 'And you\'re too late... AgAiN!! ',
    triggeredByNext: () => {
      ghost.playAnimation(`Idle_002`, true, 3)
    },
  },
  {
    text: 'Your foolishness just keeps reaching new heights!',
    triggeredByNext: () => {
      ghost.playAnimation(`Idle_002`, true, 3)
    },
  },
  {
    text: `My demon portal to the other side is almost complete!`,
    
  },
  {
    text: `I'll just need to take one last life as a sacrifice ...`,
    triggeredByNext: () => {
      ghost.playAnimation(`Idle_003`, true, 3)
    },  
    
  },
  {
    text: `Well... WHO should that BE? `,
    triggeredByNext: () => {
      //ghostControlInjured.playAnimation(`Dismissing`, true, 3.3)
      ghost.getComponent(Ghost).state = ghostState.MOVING
      
      ghost.playAnimation(`Idle_001`, false)
    
      SOUNDS.actionLoopSource.playing = true
      setGunUseable()
      ghost.playAnimation(`Idle_002`, false)
      
    },
    isEndOfDialog: true,
  },
  {
    text: 'AARRRRRRRRGGHHHHHHH',    
  },
  {
    text: 'You won this round, but for nothing! ',
  },
  {
    text: 'The portal will be completed with or without your help!',
  },
  {
    text: 'I\'ll become stronger than ever before!',
  },
  {
    text: 'And when I return...',
  },
  {
    text: `...I won't come alone.`,
    triggeredByNext: () => {
      //ghostControlInjured.playAnimation(`HeadShake_No`, true, 1.83)
      onBossDead()
    },
    isEndOfDialog: true,
  },
  
]

