<template>
  <div class="vc-input" 
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    :style="dStyles"
    :class="{'is-clear':clearable}"
    >
    <input
      :tabindex="tabindex"
      class="vc-input-inner"
      v-bind="$attrs"
      :type="type"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="autoComplete"
      :value="currentValue"
      ref="input"
      @compositionstart="handleComposition"
      @compositionupdate="handleComposition"
      @compositionend="handleComposition"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    <span class="vc-input-clear" v-if="showClear" @click="clear">
      <svg-icon  icon-class="clear" />
    </span>
  </div>
</template>

<script>
import { isKorean } from '@/utils/shared'
export default {
  inheritAttrs: false,
  data() {
    return {
      currentValue: this.value === undefined || this.value === null
        ? ''
        : this.value,
      textareaCalcStyle: {},
      hovering: false,
      focused: false,
      isOnComposition: false,
      valueBeforeComposition: null
    }
  },
  props: {
    value: [String, Number],
    bgcolor: {
      type: String,
      default: '#fff'
    },
    size: Number,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autoComplete: {
      type: String,
      default: 'off'
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    tabindex: String
  },
  watch: {
    value(val, oldValue) {
      this.setCurrentValue(val)
    }
  },
  computed: {
    dStyles() {
      const style = {}
      if (this.size) style['font-size'] = this.inputFSize
      if (this.bgcolor) style['background'] = this.bgcolor
      return style
    },
    inputFSize() { // 按钮字体px转化成vw
      if (!this.size) return ''
      return this.size / 750 * 100 + 'vw'
    },
    showClear() {
      return this.clearable &&
        !this.disabled &&
        !this.readonly &&
        this.currentValue !== '' &&
        (this.focused || this.hovering)
    }
  },
  components: {
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    blur() {
      this.$refs.input.blur()
    },
    handleBlur(event) {
      this.focused = false
      this.$emit('blur', event)
    },
    handleFocus(event) {
      this.focused = true
      this.$emit('focus', event)
    },
    handleComposition(event) {
      if (event.type === 'compositionend') {
        this.isOnComposition = false
        this.currentValue = this.valueBeforeComposition
        this.valueBeforeComposition = null
        this.handleInput(event)
      } else {
        const text = event.target.value
        const lastCharacter = text[text.length - 1] || ''
        this.isOnComposition = !isKorean(lastCharacter)
        if (this.isOnComposition && event.type === 'compositionstart') {
          this.valueBeforeComposition = text
        }
      }
    },
    handleInput(event) {
      const value = event.target.value
      this.setCurrentValue(value)
      if (this.isOnComposition) return
      this.$emit('input', value)
    },
    handleChange(event) {
      this.$emit('change', event.target.value)
    },
    setCurrentValue(value) {
      if (this.isOnComposition && value === this.valueBeforeComposition) return
      this.currentValue = value
      if (this.isOnComposition) return
    },
    clear() {
      this.$emit('input', '')
      this.$emit('change', '')
      this.$emit('clear')
      this.setCurrentValue('')
      this.focus()
    }
  }
}
</script>

<style lang='postcss'>
@import '@/styles/variables.css';
.vc-input{
  position: relative;
  font-size: inherit;
  display: inline-block;
  background-color: transparent;
  width: 100%;
  &.is-clear{
    padding-right: 60px;
  }
}
.vc-input-clear{
  position: absolute;
  right: 0;
  top:50%;
  color: #dcdcdc;
  transform: translateY(-50%);
}
.vc-input-inner {
  -webkit-appearance: none;
  background-image: none;
  border: none;
  color: inherit;
  display: inline-block;
  font-size: inherit;
  outline: none;
  padding: 0 1px;
  width: 100%;
}
input::-webkit-input-placeholder {
	color: var(--input-placeholder);
}
input:-ms-input-placeholder { 
	color: var(--input-placeholder);
}
input:-moz-placeholder { 
	color: var(--input-placeholder);
}
input::-moz-placeholder { 
	color: var(--input-placeholder);
}
</style>
