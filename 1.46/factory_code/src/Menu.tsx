import { icons, labels, selectedIcons } from './artwork'
import { factory } from './factory'
import './Menu.css'

function MenuItem({ index }: { index: number }) {
  return (
    <div
      class="menu-item"
      style={{
        left: 135 + 110 * (index - factory.selected),
        opacity: Math.abs(index - factory.selected) <= 1 ? 1 : 0,
      }}
    >
      <button
        class="menu-icon menu-button"
        onClick={() => {
          if (index === factory.selected) {
            factory.open()
          }
        }}
      >
        <img src={index === factory.selected ? selectedIcons[index] : icons[index]} />
      </button>
      <span class={index === factory.selected ? 'menu-label selected' : 'menu-label'}>
        {labels[index]}
      </span>
    </div>
  )
}

export function Menu() {
  return (
    <div class="screen" style={{ opacity: factory.opacity }}>
      <img class="background" src="/images/menu.png" />
      <img class="selection" src="/images/selection.png" />
      <MenuItem index={0} />
      <MenuItem index={1} />
      <MenuItem index={2} />
    </div>
  )
}
