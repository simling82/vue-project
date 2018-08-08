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
  </div>
</template>

<script>
import Datetime from 'vux-components/datetime'
import Group from 'vux-components/group'
import $common from '@common/js/common.js'
import $sort from '@common/js/sort.js'

export default {
  data () {
    let data = {
      updateArgs: [true, true, {duration: 1000}],
      uriThreadUseRate: $common.buildChartOptions({title: ' 线程使用率(%)', unit: '%'}),
      startDate: '2018-08-02 16:00',
      endDate: '2018-08-03 08:00',
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
        url: 'http://' + window.location.hostname + ':8087/api/queryThreadUsageRate{?metric}',
        params: {
          uri: '*', // 3110_231，可以模糊匹配，并分组
          startDate: this.startDate,
          endDate: this.endDate,
          service: 'mobAttention',
          ips: '116.31.122.25',
          ports: '8951',
          modelId: 'queue_2',
          modelType: '1',
          aggregator: 'avg'
        },
        chart: this.uriThreadUseRate,
        sort: (series) => { // 自定义排序实现：线程使用率排序
          return $sort.useRateSortBySeries(series)
        }
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
