import directive from './src/directive' // 封装为指令
import service from './src/index' // 封装为服务

export default {
  install(Vue) {
    Vue.use(directive)
    Vue.prototype.$loading = service
  },
  directive,
  service
}
