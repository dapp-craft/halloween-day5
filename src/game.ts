import { scene } from "./modules/scene";
import { addBoss } from "./modules/ghostBoss";
import { setGunActive, setGunInActive } from "./modules/gun";
import { addNPCs } from "./finalHuntdown";
import { addCreeper } from "./modules/creep";
import { swapMansion } from "./modules/allowPlayerIn";
import { openMainDoor } from "./modules/mansion";
import { areaEntity } from "./modules/cameraMode";

  
addNPCs()
addBoss()
addCreeper()
//openMainDoor()
scene.isSceneLoaded = true
engine.addEntity(areaEntity)

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

onSceneReadyObservable.add(() => {
  swapMansion('out')
})