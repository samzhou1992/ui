import icon from './icon'
import properties from './properties'
import options from './options'
import view from './view'

export default register => {
  register({
    type: 'multi-xy',
    name: 'Split Graphs',
    graphic: icon,
    component: view,
    initial: properties,
    options,
  })
}
