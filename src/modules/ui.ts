import { canvas, SFFont } from '@dcl/ui-scene-utils'

//const canvas = new UICanvas()

let ghostHealthContainer = new UIContainerRect(canvas)
ghostHealthContainer.visible = false
ghostHealthContainer.height = '4%'
ghostHealthContainer.hAlign = 'center'
ghostHealthContainer.vAlign = 'top'
ghostHealthContainer.width = "20%"
ghostHealthContainer.color = Color4.FromHexString(`#000000ff`)

let ghostHealthBar = new UIContainerRect(ghostHealthContainer)
ghostHealthBar.visible = true
ghostHealthBar.height = '80%'
ghostHealthBar.hAlign = 'left'
ghostHealthBar.vAlign = 'center'
ghostHealthBar.width = "100%"
ghostHealthBar.color = Color4.FromHexString(`#0066bbff`)

let ghostHealthTitle = new UIText(ghostHealthContainer)
ghostHealthTitle.visible = true
ghostHealthTitle.value = "Cult Leader"
ghostHealthTitle.height = '100%'
ghostHealthTitle.hAlign = 'center'
ghostHealthTitle.hTextAlign = 'center'
ghostHealthTitle.vTextAlign = 'center'
ghostHealthTitle.vAlign = 'center'
//ghostHealthTitle.positionY = "-80%"
ghostHealthTitle.width = "100%"



export function showGhostHealthUI(_visible: boolean) {
  ghostHealthContainer.visible = _visible
}

export function setGhostHealth(_hp: number) {
  if (_hp > 0 && _hp < 100) {
    ghostHealthBar.width = (Math.floor(_hp).toString() + "%")
  }
}

export const CursorMessageContainer = new UIContainerRect(canvas)
CursorMessageContainer.visible = false
CursorMessageContainer.width = '30%'
CursorMessageContainer.height = '15%'
CursorMessageContainer.vAlign = 'center'
CursorMessageContainer.hAlign = 'center'
CursorMessageContainer.positionY = '15%'
CursorMessageContainer.color = Color4.FromHexString(`#000000bb`)

export const CursorMessageTitle = new UIText(CursorMessageContainer)
CursorMessageTitle.value = "ENTRY DENIED"
CursorMessageTitle.width = '100%'
CursorMessageTitle.height = '30%'
//CursorMessageTitle.positionY = '30%'
CursorMessageTitle.vAlign = 'top'
CursorMessageTitle.hAlign = 'center'
CursorMessageTitle.hTextAlign = 'center'
CursorMessageTitle.vTextAlign = 'center'
CursorMessageTitle.fontSize = 14
CursorMessageTitle.color = Color4.White()

export const CursorMessage = new UIText(CursorMessageContainer)
CursorMessage.value = "CULT MEMBERS ONLY"
CursorMessage.width = '100%'
CursorMessage.height = '30%'
CursorMessage.positionY = '-5%'
CursorMessage.vAlign = 'center'
CursorMessage.hAlign = 'center'
CursorMessage.hTextAlign = 'center'
CursorMessage.vTextAlign = 'center'
CursorMessage.fontSize = 24
CursorMessage.color = Color4.Yellow()
CursorMessage.outlineColor = Color4.Yellow()
CursorMessage.outlineWidth = 0.2


export function setCursorMessage(_title: string, _msg: string) {

  if (!CursorMessageContainer.visible) {
    engine.addSystem(new CursorMessageTimeout(3))
  }
  CursorMessageTitle.value = _title
  CursorMessage.value = _msg
  CursorMessageContainer.visible = true
}

class CursorMessageTimeout {
  timer = 0
  duration = 3

  constructor(time?: number) {
    this.duration = time
  }
  update(dt: number) {
    if (this.timer < this.duration) {
      this.timer += dt
    }
    else {
      CursorMessageContainer.visible = false
      engine.removeSystem(this)
    }
  }

}