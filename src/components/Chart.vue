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
      <highcharts class="chart" :options="uriLatencySum" :updateArgs="updateArgs"></highcharts>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts'
import Datetime from 'vux/src/components/datetime'
import Group from 'vux/src/components/group'

export default {
  data () {
    let data = {
      updateArgs: [true, true, {duration: 1000}],
      uriCount: this.buildChartOptions({title: '请求数(次)', unit: '次'}),
      uriLatencySum: this.buildChartOptions({title: '请求总耗时(毫秒)', unit: '毫秒'}),
      startDate: this.getTimeFomart(new Date().getTime() - 3600 * 1000),
      endDate: this.getTimeFomart(),
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
      this.renderChart({
        params: {
          metric: 'uri.count',
          service: 'mobAttention',
          startDate: this.startDate,
          endDate: this.endDate,
          aggregator: 'zimsum',
          downsample: '1m-sum',
          uri: '3110_1'
        },
        chart: this.uriCount
      })
      this.renderChart({
        params: {
          metric: 'uri.latency.sum',
          service: 'mobAttention',
          startDate: this.startDate,
          endDate: this.endDate,
          aggregator: 'zimsum',
          downsample: '1m-sum',
          uri: '3110_1'
        },
        chart: this.uriLatencySum
      })
    },
    renderChart (option) {
      // let url = 'http://localhost:8087/api/query'
      let url = 'http://' + window.location.hostname + ':8087/api/query'
      this.$http.get(url, {params: option.params}).then((resp) => {
        // console.info(resp)
        let wrapper = {
          req: option.params,
          resp: resp.body
        }
        let series = this.convert(wrapper)
        // console.info(series)
        option.chart.series = series
      }, (resp) => {
        console.error(JSON.stringify(resp))
      })
    },
    buildChartOptions (option) {
      let options = {
        chart: {
          renderTo: 'req_timeoutCount_chart_all',
          type: 'spline',
          zoomType: 'x',
          panning: true,
          panKey: 'shift'
        },
        credits: {
          enabled: false
        },
        title: {
          useHTML: true,
          text: option.title,
          style: {
            font: 'normal 16px Verdana, sans-serif'
          }
        },
        xAxis: {
          type: 'datetime',
          labels: {
            formatter: function () {
              return Highcharts.dateFormat('%m-%d %H:%M', this.value)
            }
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          labels: {}
        },
        plotOptions: {
          spline: {
            marker: {
              enabled: false
            },
            turboThreshold: 5000
          },
          series: {
            cursor: 'pointer',
            events: {}
          }
        },
        tooltip: {
          crosshairs: true,
          shared: true,
          formatter: function () {
            let timeScale = this.points[0].point.timeScale
            let formatTime = '%m-%d %H:%M:%S'
            let timeScaleName = timeScale.second
            if (timeScale.s >= 60) {
              formatTime = '%m-%d %H:%M'
              timeScaleName = timeScale.minute
            }
            let s = '<b>' + Highcharts.dateFormat(formatTime, this.x) + ', 间隔' + timeScaleName + '</b>'
            this.points.forEach((item) => {
              s += '<br/><span style="color:' + item.series.color + '">\u25CF</span>  ' + item.series.name + ': ' + item.y + option.unit
            })
            return s
          }
        },
        exporting: {
          enabled: false
        },
        series: []
      }
      return options
    },
    convert (wrapper) {
      // console.info(data)
      let timeScale = this.timeScale(wrapper.req.downsample)
      let series = []
      wrapper.resp.forEach((item) => {
        let serie = {
          name: item.tags.key,
          data: []
        }
        Object.keys(item.dps).forEach((key) => {
          let value = item.dps[key]
          let point = {
            x: parseInt(key) * 1000,
            y: value,
            timeScale: timeScale
          }
          serie.data.push(point)
        })
        series.push(serie)
      })
      return series
    },
    timeScale (scaleName) {
      if (scaleName === '1m-sum') {
        return {
          s: 60,
          m: 1,
          second: '60秒',
          minute: '1分'
        }
      } else if (scaleName === '5m-sum') {
        return {
          s: 300,
          m: 5,
          second: '300秒',
          minute: '5分'
        }
      } else if (scaleName === '1h-sum') {
        return {
          s: 3600,
          m: 60,
          second: '3600秒',
          minute: '60分'
        }
      } else {
        return {
          s: 20
        }
      }
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
    },
    getTimeFomart (time) {
      if (!time) {
        time = new Date().getTime()
      } else if (time instanceof Date) {
        time = time.getTime()
      }
      return Highcharts.dateFormat('%Y-%m-%d %H:%M', time)
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
