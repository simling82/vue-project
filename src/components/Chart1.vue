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
      <highcharts class="chart" :options="uriThreadUseRate" :updateArgs="updateArgs"></highcharts>
    </div>
    <div class="row" style="border: 1px solid rgb(204, 204, 204); position: relative; margin: 5px 0px; text-align: center;">
      <highcharts class="chart" :options="uriCount" :updateArgs="updateArgs"></highcharts>
    </div>
    <div class="row" style="border: 1px solid rgb(204, 204, 204); position: relative; margin: 5px 0px; text-align: center;">
      <highcharts class="chart" :options="uriLatencySum" :updateArgs="updateArgs"></highcharts>
    </div>
    <!--<div class="row" style="border: 1px solid rgb(204, 204, 204); position: relative; margin: 5px 0px; text-align: center;">-->
      <!--<highcharts class="chart" :options="uriLatencyAvg" :updateArgs="updateArgs"></highcharts>-->
    <!--</div>-->
  </div>
</template>

<script>
import {Group, Datetime} from 'vux'
import $common from '@common/js/common.js'
import $sort from '@common/js/sort.js'

export default {
  data () {
    let data = {
      updateArgs: [true, true, {duration: 1000}],
      uriThreadUseRate: $common.buildChartOptions({title: '线程使用率(%)', unit: '%'}),
      uriCount: $common.buildChartOptions({title: '请求数(次)', unit: '次'}),
      uriLatencySum: $common.buildChartOptions({title: '请求时延总数(毫秒)', unit: '毫秒'}),
      // uriLatencyAvg: $common.buildChartOptions({title: '请求时延平均(毫秒)', unit: '毫秒'}),
      startDate: '2018-08-02 16:00',
      endDate: '2018-08-03 08:00',
      watchFlag: 0,
      sumData: null,
      countData: null,
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
    init: function () {
      $common.renderChart({
        url: 'http://' + window.location.hostname + ':8087/api/queryThreadUsageRate{?metric}',
        params: {
          // uri: '*', // 3110_231，可以模糊匹配，并分组
          startDate: this.startDate,
          endDate: this.endDate,
          // service: 'mobAttention',
          // ips: '116.31.122.25',
          // ports: '8951',
          // modelId: 'queue_2',
          // modelType: '1',
          aggregator: 'avg'
        },
        chart: this.uriThreadUseRate,
        sort: (series) => { // 自定义排序实现：线程使用率排序
          return $sort.sort(series)
        }
      })
      $common.renderChart({
        params: {
          metric: 'uri.count',
          startDate: this.startDate,
          endDate: this.endDate,
          aggregator: 'zimsum'
        },
        chart: this.uriCount,
        sort: (series) => { // 自定义排序实现：线程使用率排序
          return $sort.sort(series)
        }
      }, (resp) => {
        if (this.watchFlag < 2) {
          this.watchFlag++
        }
        this.countData = resp
      })
      $common.renderChart({
        params: {
          metric: 'uri.latency.sum',
          startDate: this.startDate,
          endDate: this.endDate,
          aggregator: 'zimsum'
        },
        chart: this.uriLatencySum,
        sort: (series) => { // 自定义排序实现：线程使用率排序
          return $sort.sort(series)
        }
      }, (resp) => {
        if (this.watchFlag < 2) {
          this.watchFlag++
        }
        this.sumData = resp
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
  },
  watch: {
    watchFlag (v) {
      console.info('watchFlag: ' + v)
      // console.info('uri.count: ' + JSON.stringify(this.uriCount.series))
      // console.info('uri.latency.sum: ' + JSON.stringify(this.uriLatencySum.series))
      if (v >= 2) {
        this.watchFlag = 0
        // let avg = []
        // let count = this.uriCount.series
        // let sum = this.uriLatencySum.series
        // let series = []
        // for (let i = 0; i < count.length; i++) {
        //   let serie = {
        //     name: count[i].name,
        //     data: []
        //   }
        //   for (let j = 0; j < count[i].data.length; j++) {
        //
        //     let point = {
        //       x: count[j].x,
        //       y: Math.round(sum[i].y / count[i].y * 100) / 100,
        //       timeScale: count[i].timeScale
        //     }
        //     avg.push(point)
        //   }
        // }
        // console.info('uri.avg: ' + JSON.stringify(avg))
        // this.uriLatencyAvg = avg
      }
    }
  }
}
</script>

<style scoped>
</style>
