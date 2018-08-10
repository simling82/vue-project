import Vue from 'vue'
import Router from 'vue-router'
import Chart from '@components/Chart'
import Chart1 from '@components/Chart1'
import Charts from '@components/Charts'
// import Grid from '@components/Grid'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/chart',
      name: 'Chart',
      component: Chart
    },
    {
      path: '/chart1',
      name: 'Chart1',
      component: Chart1
    },
    {
      path: '/Charts',
      name: 'Charts',
      component: Charts
    }
  ]
})
