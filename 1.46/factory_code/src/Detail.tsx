import { backgrounds, colors, icons, labels, labelColors } from './artwork'
import { factory } from './factory'
import './Detail.css'

function arcPath(centerX: number, radius: number, sweep: number): string {
  if (sweep <= 0) {
    return 'M 0 0'
  }

  const start = (135 * Math.PI) / 180
  const end = ((135 + sweep) * Math.PI) / 180
  const startX = centerX + radius * Math.cos(start)
  const startY = 180 + radius * Math.sin(start)
  const endX = centerX + radius * Math.cos(end)
  const endY = 180 + radius * Math.sin(end)

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${sweep > 180 ? 1 : 0} 1 ${endX} ${endY}`
}

export function Detail() {
  const radius = (250 + (factory.selected === 1 ? 2 : factory.selected === 2 ? 6 : 0) - 25) / 2
  const centerX = factory.selected === 1 ? 181 : 180
  const color = colors[factory.selected]

  return (
    <div class="screen" style={{ opacity: factory.opacity }}>
      <img class="background" src={backgrounds[factory.selected]} />
      <svg class="dial" width="360" height="360" viewBox="0 0 360 360">
        <path d={arcPath(centerX, radius, 270)} fill="none" stroke="#ffffff" stroke-width="25" />
        <path
          d={arcPath(centerX, radius, (270 * factory.value) / factory.maximum)}
          fill="none"
          stroke={color}
          stroke-width="25"
        />
      </svg>
      <img class="detail-icon" src={icons[factory.selected]} />
      <span class="detail-value" style={{ color: labelColors[factory.selected] }}>
        {factory.value + (factory.selected === 1 ? '°C' : '%')}
      </span>
      <span class="detail-label">{labels[factory.selected]}</span>
      <button class="return" onClick={() => factory.back()}>
        Return
      </button>
    </div>
  )
}
