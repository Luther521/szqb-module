import VcList from './src/List'

/* istanbul ignore next */
VcList.install = function(Vue) {
  Vue.component('vc-list', VcList)
}

export default VcList
