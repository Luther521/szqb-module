<template>
  <div id="app">
    <pre >
      <code class="javascript">// Static source code
        function(test) { 
          console.log(test)
        }
      </code>
    </pre>
    <h1>Flex常规布局</h1>
    <h2>1. 单列布局</h2>
    <h3 class="info">1.1 - 水平居中</h3>
    <div class="parent error" flexcontainer justify-content-center >
      <div class="children">wqweqweqw</div>
    </div> 
    <h3>1.2 - 垂直居中</h3>
    <div class="parent" flexcontainer align-items-center >
      <div class="children"></div>
    </div>
    <h3>1.3 - 水平垂直居中</h3>
    <div class="parent" flexcontainer justify-content-center align-items-center >
      <div class="children"></div>
    </div> 
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    startHacking() {
      this.$notify({
        title: 'It Works',
        message: 'We have laid the groundwork for you. Now it\'s your time to build something epic!',
        duration: 6000
      })
    }
  }
}
</script>

<style lang="postcss">
  @import '@/styles/variables.css';
  .parent{
    width: 100%;
    height: 200px;
    background-color: var(--brown500);
  }
  .children{
    width: 100px;
    height: 100px;
    background-color: bisque;
  }
</style>
