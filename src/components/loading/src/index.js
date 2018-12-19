import Vue from 'vue'
import loadingVue from './loading.vue'
import { addClass, removeClass, getStyle } from '@/utils/dom'
import { PopupManager } from '@/utils/popup'
import afterLeave from '@/utils/after-leave'
import merge from '@/utils/merge'

const LoadingConstructor = Vue.extend(loadingVue)

const defaults = {
  text: null,
  fullscreen: true,
  body: false,
  lock: false,
  customClass: ''
}

let fullscreenLoading

LoadingConstructor.prototype.originalPosition = ''
LoadingConstructor.prototype.originalOverflow = ''

LoadingConstructor.prototype.close = function() {
  if (this.fullscreen) {
    fullscreenLoading = undefined
  }
  afterLeave(this, _ => {
    const target = this.fullscreen || this.body
      ? document.body
      : this.target
    removeClass(target, 'vc-loading-parent--relative')
    removeClass(target, 'vc-loading-parent--hidden')
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
    this.$destroy()
  }, 300)
  this.visible = false
}

const addStyle = (options, parent, instance) => {
  const maskStyle = {}
  if (options.fullscreen) { // 判断是否全屏
    instance.originalPosition = getStyle(document.body, 'position')
    instance.originalOverflow = getStyle(document.body, 'overflow')
    maskStyle.zIndex = PopupManager.nextZIndex()
  } else if (options.body) {
    instance.originalPosition = getStyle(document.body, 'position')
    const arr1 = ['top', 'left']
    arr1.forEach(property => {
      const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft'
      maskStyle[property] = options.target.getBoundingClientRect()[property] +
        document.body[scroll] +
        document.documentElement[scroll] +
        'px'
    })
    const arr2 = ['height', 'width']
    arr2.forEach(property => {
      maskStyle[property] = options.target.getBoundingClientRect()[property] + 'px'
    })
  } else {
    instance.originalPosition = getStyle(parent, 'position')
  }
  Object.keys(maskStyle).forEach(property => {
    instance.$el.style[property] = maskStyle[property]
  })
}

const Loading = (options = {}) => {
  if (Vue.prototype.$isServer) return
  options = merge({}, defaults, options)
  if (typeof options.target === 'string') {
    options.target = document.querySelector(options.target)
  }
  options.target = options.target || document.body
  if (options.target !== document.body) {
    options.fullscreen = false
  } else {
    options.body = true
  }
  if (options.fullscreen && fullscreenLoading) {
    return fullscreenLoading
  }

  const parent = options.body ? document.body : options.target
  const instance = new LoadingConstructor({
    el: document.createElement('div'),
    data: options
  })

  addStyle(options, parent, instance)
  if (instance.originalPosition !== 'absolute' && instance.originalPosition !== 'fixed') {
    addClass(parent, 'vc-loading-parent--relative')
  }
  if (options.fullscreen && options.lock) {
    addClass(parent, 'vc-loading-parent--hidden')
  }
  parent.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.visible = true
  })
  if (options.fullscreen) {
    fullscreenLoading = instance
  }
  return instance
}

export default Loading
