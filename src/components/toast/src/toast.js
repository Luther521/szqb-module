import Vue from 'vue'
import toast from './toast.vue'
import { isVNode } from '@/utils/vdom'
const ToastConstructor = Vue.extend(toast)

let instance
const instances = []
let seed = 1
let zIndex = 9000
const Toast = function(options) {
  // 当前 Vue 实例是否运行于服务器。
  if (Vue.prototype.$isServer) return
  options = options || {}
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  // 参数所传关闭回调函数
  const userOnClose = options.onClose
  const id = 'Toast_' + seed++
  // 重新定义toast的关闭函数
  options.onClose = function() {
    Toast.close(id, userOnClose)
  }
  instance = new ToastConstructor({
    data: options
  })
  instance.id = id
  // 判断当前实例的内容是否为vnode
  if (isVNode(instance.Toast)) {
    instance.$slots.default = [instance.Toast]
    instance.Toast = null
  }
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visible = true
  instance.dom = instance.vm.$el
  instance.dom.style.zIndex = zIndex++
  instances.push(instance)
  return instance.vm
}
const arrtype = ['success', 'warning', 'info', 'error']
arrtype.forEach(type => {
  Toast[type] = options => {
    if (typeof options === 'string') {
      options = {
        Toast: options
      }
    }
    options.type = type
    return Toast(options)
  }
})
// 关闭指定toast实例
Toast.close = function(id, userOnClose) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i])
      }
      instances.splice(i, 1)
      break
    }
  }
}
// 关闭所有toast实例
Toast.closeAll = function() {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close()
  }
}

export default Toast
