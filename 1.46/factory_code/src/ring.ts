import { Led } from '@geastack/core'

const dataPin = 48
const pixelCount = 8
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0x8200ff, 0x0082ff, 0xff8200, 0xff0082]
const dark = [0, 0, 0, 0, 0, 0, 0, 0]

function scaleColor(color: number, scale: number): number {
  const red = (((color >> 16) & 255) * scale) >> 8
  const green = (((color >> 8) & 255) * scale) >> 8
  const blue = ((color & 255) * scale) >> 8

  return (red << 16) | (green << 8) | blue
}

function show(frame: number[]) {
  for (let index = 0; index < pixelCount; index++) {
    const color = frame[index]

    Led.setPixel(index, (color >> 16) & 255, (color >> 8) & 255, color & 255)
  }

  Led.show()
}

function chase(white: boolean, done: () => void) {
  const frame = dark.slice()
  let step = 0
  const next = () => {
    if (white && step > 0) {
      show(dark)
    }

    if (step === 5 * pixelCount) {
      done()

      return
    }

    const pixel = step % pixelCount

    frame[(pixel + pixelCount - 1) % pixelCount] = 0
    frame[pixel] = scaleColor(white ? 0xffffff : colors[pixel], 26)
    show(frame)
    step++
    setTimeout(next, 250)
  }

  next()
}

function flash(interval: number, done: () => void) {
  const frame = colors.map((color) => scaleColor(color, 26))
  let step = 0
  const next = () => {
    if (step === 10) {
      done()

      return
    }

    show(step % 2 === 0 ? frame : dark)
    step++
    setTimeout(next, interval)
  }

  next()
}

function breathe(done: () => void) {
  let frame = dark.slice()
  let step = 0
  const next = () => {
    if (step === 5 * 53) {
      done()

      return
    }

    const position = step % 53

    if (position <= 25) {
      frame = colors.map((color) => scaleColor(color, position + 1))
    } else {
      const brightness = 52 - position
      const previous = position === 26 ? 25 : brightness + 1
      // NeoPixel applies the descending ramp to its already quantized buffer.
      const scale = Math.floor(((brightness + 1) * 256 - 1) / previous)

      frame = frame.map((color) => scaleColor(color, scale))
    }

    show(frame)
    step++
    setTimeout(next, 50)
  }

  next()
}

export function startRingAnimation() {
  if (!Led.attach(dataPin, pixelCount)) {
    console.error('Could not attach the CrowPanel RGB ring')

    return
  }

  const cycle = () => {
    show(dark)
    chase(true, () =>
      flash(100, () =>
        chase(false, () =>
          flash(250, () =>
            breathe(() => {
              show(dark)
              setTimeout(cycle, 5)
            }),
          ),
        ),
      ),
    )
  }

  cycle()
}
