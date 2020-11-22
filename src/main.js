import Vue from 'vue'
import App from './App.vue'

import './styles/font.css'
import './styles/reset.css'
import './styles/global.css'

import router from './router'

import "regenerator-runtime/runtime.js";

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
