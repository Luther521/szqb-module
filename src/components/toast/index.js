import VcToast from './src/toast'

/* istanbul ignore next */
VcToast.install = function(Vue) {
  Vue.prototype.$toast = VcToast
}

export default VcToast
