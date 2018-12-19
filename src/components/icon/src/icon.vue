<template>
  <span class="icon" :class="classNames" :style="{'font-size': iconFSize}"><slot></slot></span>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 24
    }
  },
  computed: {
    classNames() {
      const obj = {}
      obj['icon-' + this.value] = true
      return obj
    },
    iconFSize() { // 按钮字体px转化成vw
      return (this.size + 8) / 750 * 100 + 'vw'
    }
  }
}
</script>

<style lang="postcss">
@import "../../../fonts/style.css";
.icon{
  position: relative;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  display: inline-block;
}
</style>
