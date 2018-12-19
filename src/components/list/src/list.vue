<template>
 <div class="vc-list" :class="{'pl': pl,'pr': pr}">
   <slot></slot>
 </div>
</template>

<script>
export default {
  props: {
    pl: Boolean,
    pr: Boolean,
    noborder: Boolean
  },
  provide() {
    return {
      vlist: this
    }
  },
  data() {
    return {

    }
  },
  components: {

  }
}
</script>

<style lang='postcss'>
.vc-list{
  position: relative;
  padding: 1px 0;
  background-color: #fff;
  &.pl{
    padding-left: 30px;
  }
  &.pr{
    padding-right: 30px;
  }
}
 
</style>
