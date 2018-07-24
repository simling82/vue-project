<template>
  <div class="chartElem">
    <h2>Chart test!</h2>
    <div class="row">
      <highcharts class="chart" :options="chartOptions" :updateArgs="updateArgs"></highcharts>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      updateArgs: [true, true, {duration: 1000}],
      // chartOptions: {}
      chartOptions: {
        'chart': {
          'renderTo': 'req_timeoutCount_chart_all',
          'type': 'spline',
          'zoomType': 'x',
          'panning': true,
          'panKey': 'shift'
        },
        'credits': {
          'enabled': false
        },
        'title': {
          'useHTML': true,
          'text': '请求超时数',
          'style': {
            'font': 'normal 16px Verdana, sans-serif'
          }
        },
        'xAxis': {
          'type': 'datetime',
          'labels': {}
        },
        'yAxis': {
          'title': {
            'text': '次数'
          },
          'labels': {}
        },
        'plotOptions': {
          'spline': {
            'marker': {
              'enabled': false
            },
            'turboThreshold': 5000
          },
          'series': {
            'cursor': 'pointer',
            'events': {}
          }
        },
        'tooltip': {
          'crosshairs': true,
          'shared': true
        },
        'exporting': {
          'enabled': false
        },
        'series': [
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  created () {

  },
  methods: {
    init () {
      let url = 'http://localhost:8087/api/query?service=mobAttention&metric=uri.count&startTime=1530523800&endTime=1530529200&aggregator=sum&downsample=1m-sum&uri=3110_1'
      this.$http.get(url).then((resp) => {
        // get body data
        console.info(resp)
        let series = this.convert(resp.body)
        console.info(series)
        this.chartOptions.series = series
      }, (resp) => {
        console.error(JSON.stringify(resp))
        // error callback
      })
    },
    convert (data) {
      // console.info(data)
      let series = []
      data.forEach((item) => {
        let serie = {
          name: item.metric,
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
