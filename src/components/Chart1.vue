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
import Highcharts from 'highcharts'
import Datetime from 'vux/src/components/datetime'
import Group from 'vux/src/components/group'

export default {
  data () {
    let data = {
      updateArgs: [true, true, {duration: 1000}],
      uriThreadUseRate: this.buildChartOptions({title: this.getTag().tag + ' 线程使用率(%)', unit: '%'}),
      startDate: '2018-08-02 16:00', //this.getTimeFomart(new Date().getTime() - 3600 * 1000),
      endDate: '2018-08-03 08:00', //this.getTimeFomart(),
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
        url: 'http://' + window.location.hostname + ':8087/api/queryThreadUsageRate{?metric}',
        params: {
          // uri: '3110_1',
          service: 'mobAttention',
          ips: '116.31.122.25',
          ports: '8953',
          modelId: 'queue_2',
          modelType: '1',
          aggregator: 'none',
          maxPoints: 100
        },
        chart: this.uriThreadUseRate
      })
    },
    renderChart (option) {
      let params = this.buildQuery(option)
      option.params = params
      // let url = 'http://localhost:8087/api/query'
      if (!option.url) {
        option.url = 'http://' + window.location.hostname + ':8087/api/query{?metric}'
      }
      this.$http.get(option.url, {params: params}).then((resp) => {
        // console.info(resp)
        let wrapper = {
          req: option,
          resp: resp.body
        }
        let series = this.convert(wrapper)
        // console.info(series)
        option.chart.series = series
      }, (resp) => {
        console.error(JSON.stringify(resp))
      })
    },
    buildChartOptions: function (option) {
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
              return Highcharts.dateFormat('%H:%M', this.value)
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
              if (timeScale.m >= 60) {
                timeScaleName = timeScale.hour
              } else {
                timeScaleName = timeScale.minute
              }
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
      let timeScale = this.timeScale(wrapper.resp.query.downsample)
      let series = []
      let i = 0
      wrapper.resp.results.forEach((item) => {
        let metricName = ''
        if (Array.isArray(wrapper.req.metricName)) {
          metricName = wrapper.req.metricName[i++]
        } else if (wrapper.req.metricName) {
          metricName = wrapper.req.metricName
        } else {
          metricName = decodeURIComponent(item.tags.key)
        }
        let serie = {
          name: metricName,
          data: []
        }
        Object.keys(item.dps).forEach((key) => {
          let value = item.dps[key]
          let point = {
            x: parseInt(key) * 1000,
            y: Math.round(value * 100) / 100,
            timeScale: timeScale
          }
          serie.data.push(point)
        })
        series.push(serie)
      })
      return series
    },
    timeScale (scaleName) {
      if (scaleName.startsWith('1m')) {
        return {
          s: 60,
          m: 1,
          second: '60秒',
          minute: '1分'
        }
      } else if (scaleName.startsWith('5m')) {
        return {
          s: 300,
          m: 5,
          second: '300秒',
          minute: '5分'
        }
      } else if (scaleName.startsWith('15m')) {
        return {
          s: 900,
          m: 15,
          second: '900秒',
          minute: '15分'
        }
      } else if (scaleName.startsWith('1h')) {
        return {
          s: 3600,
          m: 60,
          second: '3600秒',
          minute: '60分',
          hour: '1时'
        }
      } else if (scaleName.startsWith('6h')) {
        return {
          s: 21600,
          m: 360,
          second: '21600秒',
          minute: '360分',
          hour: '6时'
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
    },
    getTag () {
      // TODO 获取页面url需要查询的维度tag，如uri,进程实例和服务
      let tags = {
        // uri: '3110_1',
        service: 'mobAttention',
        ips: null,
        ports: null
      }
      let tag = {
      }
      if (tags.uri) {
        tag.tag = tags.uri
      } else if (tags.service) {
        tag.tag = tags.service
      } else if (tags.ips && tags.ports) {
        tag.tag = tags.ips + tags.ports
      }
      tag.tags = tags
      return tag
    },
    buildQuery (option) {
      let tag = this.getTag()
      let params = {
        startDate: this.startDate,
        endDate: this.endDate,
        aggregator: 'zimsum',
        maxPoints: 100
      }
      Object.assign(params, tag.tags)
      Object.assign(params, option.params)
      return params
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
