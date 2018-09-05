// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import cache from './utils/vue_cache'
import Mint from 'mint-ui';
import Src from "./directives/src";

import 'mint-ui/lib/style.css';
import './css/normalize.css'
import './css/base.css'
import './css/theme.scss'

Vue.use(cache)
Vue.use(Src, {
  lazy: true
})
Vue.use(Mint)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
