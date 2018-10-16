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
    <div class="row" style="border: 1px solid rgb(204, 204, 204); position: relative; margin: 5px 0px; text-align: center;">
      <highcharts class="chart" :options="uriQps" :updateArgs="updateArgs"></highcharts>
    </div>
    <div class="row" style="border: 1px solid rgb(204, 204, 204); position: relative; margin: 5px 0px; text-align: center;">
      <highcharts class="chart" :options="uriLatencyScale" :updateArgs="updateArgs"></highcharts>
    </div>
    <div class="row" style="border: 1px solid rgb(204, 204, 204); position: relative; margin: 5px 0px; text-align: center;">
      <highcharts class="chart" :options="uriLatencyScaleRate" :updateArgs="updateArgs"></highcharts>
    </div>
    <div class="row" style="border: 1px solid rgb(204, 204, 204); position: relative; margin: 5px 0px; text-align: center;">
      <highcharts class="chart" :options="uriLatencySum" :updateArgs="updateArgs"></highcharts>
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
      uriLatencyScale: $common.buildChartOptions({title: '请求区间时延数(次)', unit: '次'}),
      uriLatencyScaleRate: $common.buildChartOptions({title: '请求区间时延率(%)', unit: '%'}),
      uriCount: $common.buildChartOptions({title: '请求数(次)', unit: '次'}),
      uriQps: $common.buildChartOptions({title: '请求QPS(次/秒)', unit: '次/秒'}),
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
        url: 'http://' + window.location.hostname + ':8087/api/queryQps{?metric}',
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          aggregator: 'zimsum'
        },
        metricName: ['QPS'],
        chart: this.uriQps
      })
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
        url: 'http://' + window.location.hostname + ':8087/api/queryLatencyRate{?metric}',
        params: {
          startDate: this.startDate,
          endDate: this.endDate,
          aggregator: 'zimsum'
        },
        metricName: ['[0,10)', '[10,20)', '[20,50)', '[50,100)', '[100,200)', '[200,500)', '[500,1000)', '[1000,2000)', '[2000,5000)', '[5000,10000)', '[10000,max)'],
        chart: this.uriLatencyScaleRate
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
          endDate: this.endDate,
          aggregator: 'zimsum'
        },
        metricName: ['平均', '总和'],
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
</style>
