import { Component, mount } from '@geastack/core'
import { Detail } from './Detail'
import { Menu } from './Menu'
import { Splash } from './Splash'
import { factory } from './factory'
import './style.css'

class App extends Component {
  template() {
    return (
      <div
        class="root"
        onRotary={(event) => factory.rotate(event.delta)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            factory.press()
          }
        }}
        onTouchStart={(event) => factory.touchStart(event.clientX, event.clientY)}
        onTouchMove={(event) => factory.touchMove(event.clientX, event.clientY)}
        onTouchEnd={() => {
          factory.dragging = false
        }}
      >
        {factory.page === 0 ? <Splash /> : factory.page === 1 ? <Menu /> : <Detail />}
      </div>
    )
  }
}

mount(App)
factory.start()
