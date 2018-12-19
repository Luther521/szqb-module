import Scroller from './src/scroller'

/* istanbul ignore next */
Scroller.install = function(Vue) {
  Vue.component(Scroller.name, Scroller)
}

export default Scroller
