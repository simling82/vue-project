// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import VueResource from 'vue-resource'

Vue.config.productionTip = false

Vue.use(HighchartsVue)
Vue.use(VueResource)

Highcharts.setOptions({ global: { useUTC: false } })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
