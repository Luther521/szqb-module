import Vue from 'vue'
import PopupManager from './popup-manager'
import { addClass, removeClass } from '../dom'
let idSeed = 1

const getDOM = function(dom) {
  if (dom.nodeType === 3) {
    dom = dom.nextElementSibling || dom.nextSibling
    getDOM(dom)
  }
  return dom
}

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    openDelay: {},
    closeDelay: {},
    zIndex: {},
    modal: {
      type: Boolean,
      default: false
    },
    modalFade: {
      type: Boolean,
      default: true
    },
    modalClass: {},
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    }
  },

  beforeMount() {
    this._popupId = 'popup-' + idSeed++
    PopupManager.register(this._popupId, this)
  },

  beforeDestroy() {
    PopupManager.deregister(this._popupId)
    PopupManager.closeModal(this._popupId)
  },

  data() {
    return {
      opened: false,
      bodyPaddingRight: null,
      computedBodyPaddingRight: 0,
      withoutHiddenClass: true,
      rendered: false
    }
  },

  watch: {
    visible(val) {
      if (val) {
        if (this._opening) return
        if (!this.rendered) {
          this.rendered = true
          Vue.nextTick(() => {
            this.open()
          })
        } else {
          this.open()
        }
      } else {
        this.close()
      }
    }
  },

  methods: {
    open(options) {
      if (!this.rendered) {
        this.rendered = true
      }
      const props = Object.assign({}, this.$props || this, options)

      if (this._closeTimer) {
        clearTimeout(this._closeTimer)
        this._closeTimer = null
      }
      clearTimeout(this._openTimer)

      const openDelay = Number(props.openDelay)
      if (openDelay > 0) {
        this._openTimer = setTimeout(() => {
          this._openTimer = null
          this.doOpen(props)
        }, openDelay)
      } else {
        this.doOpen(props)
      }
    },

    doOpen(props) {
      if (this.$isServer) return
      if (this.willOpen && !this.willOpen()) return
      if (this.opened) return

      this._opening = true

      const dom = getDOM(this.$el)

      const modal = props.modal

      const zIndex = props.zIndex
      if (zIndex) {
        PopupManager.zIndex = zIndex
      }

      if (modal) {
        if (this._closing) {
          PopupManager.closeModal(this._popupId)
          this._closing = false
        }
        if (props.lockScroll) {
          addClass(document.body, 'ovh')
        }
        PopupManager.openModal(this._popupId, PopupManager.nextZIndex(), this.modalAppendToBody ? undefined : dom, props.modalClass, props.modalFade)
      }

      if (getComputedStyle(dom).position === 'static') {
        dom.style.position = 'absolute'
      }

      dom.style.zIndex = PopupManager.nextZIndex()
      this.opened = true

      this.onOpen && this.onOpen()

      this.doAfterOpen()
    },

    doAfterOpen() {
      this._opening = false
    },

    close() {
      if (this.willClose && !this.willClose()) return

      if (this._openTimer !== null) {
        clearTimeout(this._openTimer)
        this._openTimer = null
      }
      clearTimeout(this._closeTimer)

      const closeDelay = Number(this.closeDelay)

      if (closeDelay > 0) {
        this._closeTimer = setTimeout(() => {
          this._closeTimer = null
          this.doClose()
        }, closeDelay)
      } else {
        this.doClose()
      }
    },

    doClose() {
      this._closing = true
      this.onClose && this.onClose()
      if (this.lockScroll) {
        setTimeout(this.restoreBodyStyle, 200)
      }
      this.opened = false

      this.doAfterClose()
    },

    doAfterClose() {
      PopupManager.closeModal(this._popupId)
      this._closing = false
    },
    restoreBodyStyle() {
      if (this.modal) {
        removeClass(document.body, 'ovh')
      }
    }
  }
}

export {
  PopupManager
}
