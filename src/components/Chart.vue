<template>
  <div class="chartElem">
    <h2>Chart test!</h2>
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

export default {
  data () {
    let data = {
      updateArgs: [true, true, {duration: 1000}],
      uriCount: this.buildChartOptions({attachment: {title: '请求数(次)', unit: '次'}}),
      uriLatencySum: this.buildChartOptions({attachment: {title: '请求总耗时(毫秒)', unit: '毫秒'}})
    }
    return data
  },
  mounted () {
    this.init()
  },
  created () {

  },
  methods: {
    init () {
      this.renderChart({
        params: {
          metric: 'uri.count',
          service: 'mobAttention',
          startTime: 1530523800,
          endTime: 1530529200,
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
          startTime: 1530523800,
          endTime: 1530529200,
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
        let series = this.convert(resp.body)
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
          text: option.attachment.title,
          style: {
            font: 'normal 16px Verdana, sans-serif'
          }
        },
        xAxis: {
          type: 'datetime',
          labels: {}
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
        // tooltip: {
        //   crosshairs: true,
        //   shared: true
        // },
        tooltip: {
          crosshairs: true,
          shared: true,
          formatter: function () {
            // let timeScale = this.points[0].point.timeScale
            let formatTime = '%m-%d %H:%M:%S'
            // if(timeScale >= 60000){
            //     formatTime = '%m-%d %H:%M';
            // }
            let s = '<b>' + Highcharts.dateFormat(formatTime, this.x * 1000) + '</b>'
            this.points.forEach((item) => {
              s += '<br/><span style="color:' + item.series.color + '">\u25CF</span>  ' + item.series.name + ': ' + item.y + option.attachment.unit
            })
            // if (timeScale) {
            //   s += '<b>, 间隔' + formatTimeScale(timeScale) + '</b>'
            // }
            // 自定义toolTips
            // if (myToolTips) {
            //   s += myToolTips(this, unitName, attachToolTipsMsg)
            // } else {
            //   $.each(this.points, function (index, element) {
            //     var yValue = formatNumber(this.y, 2)
            //     if (this.y >= 10000) {
            //       yValue = formatNumberSize(this.y)
            //     }
            //     s += '<br/><span style="color:' + this.series.color + '">\u25CF</span>  ' + this.series.name + ': ' + yValue + unitName
            //   })
            // }

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
    convert (data) {
      // console.info(data)
      let series = []
      data.forEach((item) => {
        let serie = {
          name: item.tags.key,
          data: []
        }
        Object.keys(item.dps).forEach((key) => {
          let value = item.dps[key]
          let point = {
            x: parseInt(key),
            y: value
          }
          serie.data.push(point)
        })
        series.push(serie)
      })
      return series
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
