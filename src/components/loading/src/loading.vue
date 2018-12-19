<template>
  <transition name="vc-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="vc-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="vc-loading-spinner">
        <svg v-if="!spinner" class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
        <svg-icon v-else className="vc-loading"  :icon-class="spinner" />
        <p v-if="text" class="vc-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        text: null, // 加载文字
        spinner: null, // 自定义spinner
        background: null, // 背景替换
        fullscreen: true, // 是否全屏
        visible: false, // 是否显示
        customClass: '' // 自定义样式
      }
    },

    methods: {
      handleAfterLeave() {
        this.$emit('after-leave')
      },
      setText(text) {
        this.text = text
      }
    }
  }
</script>
<style lang="postcss" scoped>
.vc-loading-mask {
  position: absolute;
  z-index: 2000;
  background-color: hsla(0,0%,100%,.9);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity .3s;
  &.is-fullscreen{
    position: fixed;
  }
}
.vc-loading-spinner {
    top: 50%;
    width: 100%;
    text-align: center;
    position: absolute;
    transform: translateY(-50%);
    font-size: 28px;
    & .circular {
      height: 50px;
      width: 50px;
      animation: loading-rotate 2s linear infinite;
    }
    & .path {
      animation: loading-dash 1.5s ease-in-out infinite;
      stroke-dasharray: 90,150;
      stroke-dashoffset: 0;
      stroke-width: 2;
      stroke: #409eff;
      stroke-linecap: round;
    }
    & .vc-loading{
      color: #409eff;
    }
}
.vc-loading-text{
    color: #409eff;
    margin: 10px 0;
}
.vc-loading-parent--relative {
  position: relative;
  border-color: transparent;
}
.vc-loading-parent--hidden{
  overflow: hidden;
}
@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
</style>

