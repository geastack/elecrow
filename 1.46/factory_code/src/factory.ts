import { Display, Store } from '@geastack/core'
import { startRingAnimation } from './ring'

class Factory extends Store {
  page = 0
  opacity = 1
  transitionTimer = 0
  selected = 1
  values: number[] = [50, 100, 50]
  clickTimer = 0
  touchX = 0
  touchY = 0
  dragging = false
  swipeHandled = false

  start() {
    setBulbPercent(50)
    Display.setBrightness(50)
    startRingAnimation()
    setTimeout(() => this.showPage(1, 250), 1500)
  }

  showPage(page: number, duration: number) {
    if (this.transitionTimer !== 0) {
      clearInterval(this.transitionTimer)
    }

    this.opacity = 0
    this.page = page
    const started = Date.now()

    this.transitionTimer = setInterval(() => {
      this.opacity = Math.min(1, (Date.now() - started) / duration)
      if (this.opacity >= 1) {
        clearInterval(this.transitionTimer)
        this.transitionTimer = 0
      }
    }, 16)
  }

  get maximum() {
    return this.selected === 1 ? 200 : 100
  }

  get value() {
    return this.values[this.selected]
  }

  open() {
    if (this.page === 1 && !this.swipeHandled) {
      this.showPage(2, 200)
    }
  }

  back() {
    this.showPage(1, 200)
  }

  rotate(delta: number) {
    if (this.page === 1) {
      this.selected = Math.max(0, Math.min(2, this.selected + delta))
    }

    if (this.page === 2) {
      this.setValue(this.value + delta * 5)
    }
  }

  press() {
    if (this.page === 0) {
      return
    }

    if (this.clickTimer !== 0) {
      clearTimeout(this.clickTimer)
      this.clickTimer = 0
      if (this.page === 2) {
        this.back()
      }

      return
    }

    this.clickTimer = setTimeout(() => {
      this.clickTimer = 0
      if (this.page === 1) {
        this.showPage(2, 200)
      }
    }, 300)
  }

  setValue(value: number) {
    const bounded = Math.max(0, Math.min(this.maximum, value))

    this.values[this.selected] = bounded
    if (this.selected === 1) {
      setBulbPercent(bounded / 2)
    }

    if (this.selected === 2) {
      Display.setBrightness(bounded)
    }
  }

  touchStart(x: number, y: number) {
    this.touchX = x
    this.touchY = y
    this.swipeHandled = false
    const radius = Math.hypot(x - 180, y - 180)

    this.dragging =
      this.page === 2 && radius >= 91 && radius <= 138 && !(y >= 270 && x >= 140 && x <= 220)
    if (this.dragging) {
      this.setAngle(x, y)
    }
  }

  touchMove(x: number, y: number) {
    if (this.dragging && this.page === 2) {
      this.setAngle(x, y)
    }

    if (this.page !== 1 || this.swipeHandled) {
      return
    }

    const dx = x - this.touchX

    if (Math.abs(dx) >= 30 && Math.abs(dx) > Math.abs(y - this.touchY)) {
      this.swipeHandled = true
      this.rotate(dx < 0 ? 1 : -1)
    }
  }

  setAngle(x: number, y: number) {
    const angle = ((Math.atan2(y - 180, x - 180) * 180) / Math.PI + 585) % 360
    const progress = angle > 315 ? 0 : Math.min(270, angle)

    this.setValue(Math.round((progress * this.maximum) / 270))
  }
}

export const factory = new Factory()
