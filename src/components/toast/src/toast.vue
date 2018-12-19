<template>
  <transition name="toast-fade">
    <div class="vc-toast" v-show="visible" :style="{'top':top}">
      <div class="vc-ct">
        <div class="toast-icon" v-if="toasttype">
          <svg-icon v-if="type === 'success'" class-name="success" icon-class="correct"  />
          <svg-icon v-if="type === 'warning'" class-name="warning" icon-class="warning"  />
          <svg-icon v-if="type === 'error'" class-name="error" icon-class="error"  />
        </div>
        <span class="vc-toast-text" v-html="message"></span>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'VcToast',
    data() {
      return {
        visible: false,
        message: '',
        top: '50%',
        duration: 3000,
        closed: false,
        onClose: null,
        type: 'info'
      }
    },
    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false
          // 关闭时销毁实例
          this.$el.addEventListener('transitionend', this.destroyElement)
        }
      }
    },
    computed: {
      toasttype() {
        return this.type !== 'info'
      }
    },
    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement)
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      },
      close() {
        this.closed = true
        if (typeof this.onClose === 'function') {
          this.onClose(this)
        }
      },
      clearTimer() {
        clearTimeout(this.timer)
      },
      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            if (!this.closed) {
              this.close()
            }
          }, this.duration)
        }
      }
    },
    mounted() {
      this.startTimer()
    },
    beforeDestroy() {
    }
  }
</script>
<style lang="postcss" scoped>
  .vc-toast{
    position: fixed;
    top: 50%;
    width: 100%;
    font-size: 28px;
    text-align: center;
    z-index: 9999;
    transform: translateY(-50%);
    display: block;
    & .vc-ct{
      display: inline-block;
      color: #fff;
      border-radius:4px;
      padding:1em 2em;
      max-width: 80%;
      background: rgba(0, 0, 0, .8);
    }
    & .toast-icon{
      font-size:80px;
      padding-bottom:20px;
    }
  }
  .vc-toast-text{
    display: inline-block;
    word-break: break-all;
    text-align: center;
  }
  
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.toast-fade-enter-active {
  transition: all .3s ease;
}
.toast-fade-leave-active {
  transition: all .1s ease;
}
.toast-fade-enter, .toast-fade-leave-to
/* .toast-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-30%);
  opacity: 0;
}
</style>
