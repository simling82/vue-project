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
      <highcharts class="chart" :options="uriLatencyScale" :updateArgs="updateArgs"></highcharts>
    </div>
    <div class="row" style="border: 1px solid rgb(204, 204, 204); position: relative; margin: 5px 0px; text-align: center;">
      <highcharts class="chart" :options="uriCount" :updateArgs="updateArgs"></highcharts>
    </div>
    <div class="row" style="border: 1px solid rgb(204, 204, 204); position: relative; margin: 5px 0px; text-align: center;">
      <highcharts class="chart" :options="uriLatencySum" :updateArgs="updateArgs"></highcharts>
    </div>
  </div>
</template>

<script>
import Datetime from 'vux/src/components/datetime'
import Group from 'vux/src/components/group'
import $common from '@common/js/common.js'

export default {
  data () {
    let data = {
      updateArgs: [true, true, {duration: 1000}],
      uriLatencyScale: $common.buildChartOptions({title: '请求时延区间(次)', unit: '次'}),
      uriCount: $common.buildChartOptions({title: '请求数(次)', unit: '次'}),
      uriLatencySum: $common.buildChartOptions({title: '请求时延统计(毫秒)', unit: '毫秒'}),
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
          metric: ['uri.latency.scale.0.10', 'uri.latency.scale.10.20', 'uri.latency.scale.20.50', 'uri.latency.scale.50.100', 'uri.latency.scale.100.200', 'uri.latency.scale.200.500'],
          startDate: this.startDate,
          endDate: this.endDate,
          aggregator: 'zimsum'
        },
        metricName: ['[0,10)', '[10,20)', '[20,50)', '[50,100)', '[100,200)', '[200,500)'],
        chart: this.uriLatencyScale
      })
      $common.renderChart({
        params: {
          metric: 'uri.count',
          startDate: this.startDate,
          endDate: this.endDate,
          aggregator: 'zimsum'
        },
        metricName: '请求数',
        chart: this.uriCount
      })
      $common.renderChart({
        url: 'http://' + window.location.hostname + ':8087/api/queryStatistics{?metric}',
        params: {
          startDate: this.startDate,
          endDate: this.endDate
        },
        metricName: ['平均', '总和', '最大', '最小'],
        chart: this.uriLatencySum
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
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
#colorPicker {
  border: 0;
  padding: 0;
  margin: 0;
  width: 30px;
  height: 30px;
}
.numberInput {
  width: 30px;
}
</style>
