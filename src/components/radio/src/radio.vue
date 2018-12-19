<template>
  <label
    class="vl-radio"
    flexcontainer align-items-center
    :class="[
      border && radioSize ? 'vl-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    role="radio"
    :aria-checked="model === label"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.space.stop.prevent="model = isDisabled ? model : label"
  >
    <span class="vl-radio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
    <span class="vl-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="vl-radio__inner">
        <svg-icon v-if="model === label" class-name="r-icon active" icon-class="checkbox-marked-circle"></svg-icon>
        <svg-icon v-else class-name="r-icon" icon-class="checkbox-blank-circle-outline"></svg-icon>
      </span>
      <input
        class="vl-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      >
    </span>
    
  </label>
</template>
<script>
  import Emitter from '@/mixins/emitter'

  export default {
    name: 'VcRadio',
    mixins: [Emitter],
    componentName: 'VlRadio',
    props: {
      value: {},
      label: {},
      disabled: Boolean,
      name: String,
      border: Boolean,
      size: String
    },
    data() {
      return {
        focus: false
      }
    },
    computed: {
      isGroup() {
        let parent = this.$parent
        while (parent) {
          if (parent.$options.componentName !== 'VlRadioGroup') {
            parent = parent.$parent
          } else {
            this._radioGroup = parent
            return true
          }
        }
        return false
      },
      model: {
        get() {
          return this.isGroup ? this._radioGroup.value : this.value
        },
        set(val) {
          console.log(val)
          if (this.isGroup) {
            this.dispatch('VlRadioGroup', 'input', [val])
          } else {
            this.$emit('input', val)
          }
        }
      },
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize
      },
      radioSize() {
        const temRadioSize = this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
        return this.isGroup
          ? this._radioGroup.radioGroupSize || temRadioSize
          : temRadioSize
      },
      isDisabled() {
        return this.isGroup
          ? this._radioGroup.disabled || this.disabled || (this.elForm || {}).disabled
          : this.disabled || (this.elForm || {}).disabled
      },
      tabIndex() {
        return !this.isDisabled ? (this.isGroup ? (this.model === this.label ? 0 : -1) : 0) : -1
      }
    },

    methods: {
      handleChange() {
        this.$nextTick(() => {
          this.$emit('change', this.model)
          this.isGroup && this.dispatch('VlRadioGroup', 'handleChange', this.model)
        })
      }
    }
  }
</script>
<style lang="postcss">
.vl-radio{
  position: relative;
  height: 110px;
  background-color: #fff;
}
.vl-radio__label{
  flex: 1;
}
.vl-radio__input{
  width: 50px;
  
}
.vl-radio__original{
  opacity: 0;
  outline: none;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
}
.vl-radio__inner{
  position: relative;
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 48px;
  & .r-icon{
    position: absolute;
    top:50%;
    left: 50%;
    color:#999;
    transform: translate(-50%,-50%);
    &.active{
      color: #5492FF;
    }
  }
}
</style>
