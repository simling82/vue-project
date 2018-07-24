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
export default {
  data () {
    let data = {
      updateArgs: [true, true, {duration: 1000}],
      uriCount: this.buildChartOptions('请求数'),
      uriLatencySum: this.buildChartOptions('请求总耗时')
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
      let params = {
        metric: '',
        service: 'mobAttention',
        startTime: 1530523800,
        endTime: 1530529200,
        aggregator: 'zimsum',
        downsample: '1m-sum',
        uri: '3110_1'
      }
      params.metric = 'uri.count'
      this.renderChart({params: params}, this.uriCount)
      params.metric = 'uri.latency.sum'
      this.renderChart({params: params}, this.uriLatencySum)
    },
    renderChart (params, chart) {
      // let url = 'http://localhost:8087/api/query'
      let url = 'http://'+window.location.hostname+':8087/api/query'
      this.$http.get(url, params).then((resp) => {
        // get body data
        console.info(resp)
        let series = this.convert(resp.body)
        console.info(series)
        chart.series = series
      }, (resp) => {
        console.error(JSON.stringify(resp))
        // error callback
      })
    },
    buildChartOptions (title) {
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
          text: title,
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
        tooltip: {
          crosshairs: true,
          shared: true
        },
        exporting: {
          enabled: false
        },
        series: [
        ]
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
