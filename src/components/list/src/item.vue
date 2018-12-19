<template>
  <div class="vc-item" flexcontainer align-items-center :class="{'bd':!itemBoder}">
    <div class="left"><slot name="left"></slot></div>
    <div class="center ell"><slot></slot></div>
    <div class="right">
      <slot name="right">
        <svg-icon v-if="arrow" className="arrow" icon-class="arrow_right"  />
      </slot>
    </div>
  </div>
</template>

<script>
import icon from '@/components/icon'
export default {
  props: {
    arrow: Boolean
  },
  inject: {
    vlist: {
      default: ''
    }
  },
  computed: {
    itemBoder() {
      return (this.vlist || {}).noborder
    }
  },
  data() {
    return {

    }
  },
  components: {
    icon
  }
}
</script>

<style lang='postcss'>
  @import '@/styles/variables.css';
  .vc-item{
    position: relative;
    /* padding: 38px 0; */
    padding: 1px 0;
    height: 110px;
    color: var(--item-base-color);
    font-size: var(--item-base-font-size);
    /* &.is-ricon{
      padding-right: 50px;
      & .icon{
        position: absolute;
        top:50%;
        right: 0;
        color: var(--item-base-icon-color);
        transform: translateY(-50%);
      }
    } */
    & .arrow{
      color: var(--item-base-icon-color);
    }
    &.bd + .vc-item.bd{
      &:before{
        content: "";
        position: absolute;
        background-color:var(--item-border-color);
        display: block;
        top:0;
        left: 0;
        right: auto;
        height: 1px;
        width: 100%;
        transform-origin: 0 0;
        transform: scaleY(.5);
      }
    }
    & .center{
      flex: 1;
    }
  }
</style>
