<template>
  <div class="chartElem">
    <h2>Chart test!</h2>
    <group class="datetime-box">
      <datetime
        class="datetime-item"
        title="时间段"
        format="YYYY-MM-DD HH:mm"
        :value="startDate"
        :minuteList="minuteList"
        @on-change="changeStartTime">
      </datetime>
      <datetime
        class="datetime-item"
        title="至"
        format="YYYY-MM-DD HH:mm"
        :value="endDate"
        :minuteList="minuteList"
        @on-change="changeEndTime">
      </datetime>
    </group>
    <div class="row" style="border: 1px solid rgb(204, 204, 204); position: relative; margin: 5px 0px; text-align: center;">
      <highcharts class="chart" :options="uriCount" :updateArgs="updateArgs"></highcharts>
    </div>
  </div>
</template>

<script>
import {Group, Datetime} from 'vux'
import $common from '@common/js/common.js'

export default {
  data () {
    let data = {
      updateArgs: [true, true, {duration: 1000}],
      uriCount: $common.buildChartOptions({title: '请求数(次)', unit: '次'}),
      startDate: '2018-07-27 13:00',
      endDate: '2018-07-27 18:00',
      // startDate: this.getTimeFomart(new Date().getTime() - 3600 * 1000),
      // endDate: this.getTimeFomart(),
      minuteList: ['00', '15', '30', '45'] // 时间格式
    }
    return data
  },
  mounted () {
    this.init()
  },
  created () {
    // Highcharts.setOptions({ global: { useUTC: false } })
    // console.info(Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', new Date().getTime()))

  },
  components: {
    Group, Datetime
  },
  methods: {
    init () {
      $common.renderChart({
        params: {
          metric: 'uri.count',
          startDate: this.startDate,
          endDate: this.endDate,
          uri: '3110_231*',
          aggregator: 'zimsum'
        },
        chart: this.uriCount
      })
    },
    changeStartTime (value) {
      console.log(value)
      this.startDate = value
      this.init()
    },
    changeEndTime (value) {
      console.log(value)
      this.endDate = value
      this.init()
    }
  }
}
</script>

<style scoped>
</style>
