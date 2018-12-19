<template>
  <transition name="msgbox-fade">
    <div
      class="vc-message-box__wrapper"
      tabindex="-1"
      v-show="visible"
      @click.self="handleWrapperClick"
      role="dialog"
      aria-modal="true"
      :aria-label="title || 'dialog'">
      <div class="vc-message-box" :class="[customClass, center && 'vc-message-box--center']">
        <div class="vc-message-box__header" v-if="title">
          <div class="vc-message-box__title">
            <span>{{ title }}</span>
          </div>
        </div>
        <div class="vc-message-box__content" :class="{'notitle':!title}">
          <div class="vc-message-box__message" v-if="message !== ''">
            <slot>
              <p v-if="!dangerouslyUseHTMLString">{{ message }}</p>
              <p v-else v-html="message"></p>
            </slot>
          </div>
        </div>
        <div class="vc-message-box__btns" flexcontainer >
          <span class="confirm-button ell bt1 br1" :class="[ cancelButtonClasses ]" v-show="showCancelButton" @click="handleAction('cancel')">{{ cancelButtonText }}</span>
          <span class="confirm-button ell bt1 " :class="[ confirmButtonClasses ]" v-show="showConfirmButton" @click="handleAction('confirm')">{{ confirmButtonText }}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
  import Popup from '@/utils/popup'
  export default {
    mixins: [Popup],
    props: {
      modal: {
        default: true
      },
      lockScroll: {
        default: true
      },
      showClose: {
        type: Boolean,
        default: true
      },
      closeOnClickModal: {
        default: true
      },
      closeOnPressEscape: {
        default: true
      },
      closeOnHashChange: {
        default: true
      },
      center: {
        default: true,
        type: Boolean
      }
    },

    computed: {
      confirmButtonClasses() {
        return `primary ${this.confirmButtonClass}`
      },
      cancelButtonClasses() {
        return `${this.cancelButtonClass}`
      }
    },

    methods: {
      getSafeClose() {
        const currentId = this.uid
        return () => {
          this.$nextTick(() => {
            if (currentId === this.uid) this.doClose()
          })
        }
      },
      doClose() {
        if (!this.visible) return
        this.visible = false
        this._closing = true

        this.onClose && this.onClose()
        if (this.lockScroll) {
          setTimeout(this.restoreBodyStyle, 200)
        }
        this.opened = false
        this.doAfterClose()
        setTimeout(() => {
          if (this.action) this.callback(this.action, this)
        })
      },

      handleWrapperClick() {
        if (this.closeOnClickModal) {
          this.handleAction(this.distinguishCancelAndClose ? 'close' : 'cancel')
        }
      },
      handleAction(action) {
        this.action = action
        if (typeof this.beforeClose === 'function') {
          this.close = this.getSafeClose()
          this.beforeClose(action, this, this.close)
        } else {
          this.doClose()
        }
      }
    },

    watch: {
      visible(val) {
        if (val) {
          this.uid++
        }
      }
    },

    mounted() {
      this.$nextTick(() => {
        if (this.closeOnHashChange) {
          window.addEventListener('hashchange', this.close)
        }
      })
    },

    beforeDestroy() {
      if (this.closeOnHashChange) {
        window.removeEventListener('hashchange', this.close)
      }
    },
    data() {
      return {
        uid: 1,
        title: undefined,
        message: '',
        type: '',
        customClass: '',
        showConfirmButton: true,
        showCancelButton: false,
        action: '',
        confirmButtonText: '',
        cancelButtonText: '',
        confirmButtonLoading: false,
        cancelButtonLoading: false,
        confirmButtonClass: '',
        confirmButtonDisabled: false,
        cancelButtonClass: '',
        callback: null,
        dangerouslyUseHTMLString: false,
        distinguishCancelAndClose: false
      }
    }
  }
</script>
<style lang="postcss">
.vc-message-box__wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    &:after {
      content: "";
      display: inline-block;
      height: 100%;
      width: 0;
      vertical-align: middle;
  }
}
.vc-message-box {
    display: inline-block;
    width: 560px;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #ebeef5;
    font-size: 18px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    text-align: left;
    overflow: hidden;
    backface-visibility: hidden;
}
.vc-message-box__header{
  padding: 50px 40px 20px 40px;
  & .vc-message-box__title{
    font-size:36px;
  }
}
.vc-message-box__content {
    position: relative;
    padding: 0px 40px 50px 40px;
    font-size: 26px;
    min-height: 80px;
    &.notitle{
      padding: 80px 40px;
    }
}

.vc-message-box__btns {
    position: relative;
    text-align: center;
}
.vc-message-box--center{
  text-align: center;
}
.vc-message-box__btns{
  font-size: 0;
}
.confirm-button{
  position: relative;
  display:inline-block;
  font-size: 36px;
  padding: .9em;
  cursor: pointer;
  flex: 1;
  &:active{
    background-color: #f2f2f2;
  }
}
</style>
