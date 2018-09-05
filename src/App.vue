<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <div class="img-wrap clear" v-for="item in list">
      <img v-src="item">
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      list: [
        'http://s12.sinaimg.cn/orignal/48b6ce5df7bcde1de440b',
        'http://www.qqttxx.com/upimg/allimg/110618/1045591938-0.gif',
        'http://img2.3lian.com/2014cf/gif/10/52/16.gif',
        'http://logo.taobaocdn.com/shop-logo/d3/46/T1NCNlXoUqJ0OrtXjX.gif'
      ]
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.img-wrap {
  width: 100%;
  height: auto;
}
</style>
