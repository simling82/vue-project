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
    <div>
      <group-title> 列表 </group-title>
      <grid :cols="1" :show-lr-borders="false">
        <grid-item v-for="item in metricList.results" :key="item.tags.key" @on-item-click="onItemClick">
          <span class="grid-left">{{item.tags.key}}</span>
          <span class="grid-left">{{item.dps}}</span>
        </grid-item>
      </grid>
    </div>
  </div>
</template>

<script>
import {Group, Datetime, Grid, GridItem, GroupTitle} from 'vux'
// import $common from '@common/js/common.js'

export default {
  data () {
    let data = {
      updateArgs: [true, true, {duration: 1000}],
      startDate: '2018-07-27 13:00',
      endDate: '2018-07-27 18:00',
      // metricList: {'results': [{'value': 1}, {'value': 2}]},
      metricList: {},
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
    Group, Datetime, Grid, GridItem, GroupTitle
  },
  methods: {
    init () {
      // let data = {
      //   'query': {
      //     'metric': [ 'uri.count' ],
      //     'startTime': 1532667600,
      //     'endTime': 1532685600,
      //     'startDate': '2018-07-27 13:00:00',
      //     'endDate': '2018-07-27 18:00:00',
      //     'uri': '3110_231*',
      //     'service': '',
      //     'ips': '',
      //     'ports': '',
      //     'aggregator': 'zimsum',
      //     'downsample': '6h-sum',
      //     'maxPoints': 100,
      //     'modelId': '',
      //     'modelType': '',
      //     'filter': '*',
      //     'onlyService': false,
      //     'onlyGroup': false
      //   },
      //   'results': [ {
      //     'metric': 'uri.count',
      //     'tags': {
      //       'service': 'mobAttention',
      //       'ips': '116.31.122.25',
      //       'key': '3110_231%2B231%3C%3C8%7C158',
      //       'group': '28'
      //     },
      //     'aggregateTags': [ 'model.type', 'model.id', 'ports', 'pid', 'uri.type', 'rpc.host' ],
      //     'dps': {
      //       '1532671200': 2374.0
      //     },
      //     'sdps': { }
      //   }, {
      //     'metric': 'uri.count',
      //     'tags': {
      //       'service': 'mobAttention',
      //       'ips': '116.31.122.25',
      //       'key': '3110_231%2B9%3C%3C8%7C177',
      //       'group': '28'
      //     },
      //     'aggregateTags': [ 'model.type', 'model.id', 'ports', 'pid', 'uri.type', 'rpc.host' ],
      //     'dps': {
      //       '1532671200': 8506.0
      //     },
      //     'sdps': { }
      //   }, {
      //     'metric': 'uri.count',
      //     'tags': {
      //       'service': 'mobAttention',
      //       'rpc.host': '14.17.108.130:18099',
      //       'ips': '116.31.122.25',
      //       'key': '3110_231%2B217%3C%3C8%7C228',
      //       'group': '28'
      //     },
      //     'aggregateTags': [ 'model.type', 'model.id', 'ports', 'pid', 'uri.type' ],
      //     'dps': {
      //       '1532671200': 2374.0
      //     },
      //     'sdps': { }
      //   }, {
      //     'metric': 'uri.count',
      //     'tags': {
      //       'service': 'mobAttention',
      //       'rpc.host': '116.31.121.122:5550',
      //       'ips': '116.31.122.25',
      //       'key': '3110_231%2B5%3C%3C8%7C225',
      //       'group': '28'
      //     },
      //     'aggregateTags': [ 'model.type', 'model.id', 'ports', 'pid', 'uri.type' ],
      //     'dps': {
      //       '1532671200': 6366.0
      //     },
      //     'sdps': { }
      //   }, {
      //     'metric': 'uri.count',
      //     'tags': {
      //       'service': 'mobAttention',
      //       'ips': '116.31.122.25',
      //       'key': '3110_231%2B303%3C%3C8%7C144',
      //       'group': '28'
      //     },
      //     'aggregateTags': [ 'model.type', 'model.id', 'ports', 'pid', 'uri.type', 'rpc.host' ],
      //     'dps': {
      //       '1532671200': 5636.0
      //     },
      //     'sdps': { }
      //   }, {
      //     'metric': 'uri.count',
      //     'tags': {
      //       'service': 'mobAttention',
      //       'ips': '116.31.122.25',
      //       'key': '3110_231%2Bbatch_get_user_info',
      //       'group': '28'
      //     },
      //     'aggregateTags': [ 'model.type', 'model.id', 'ports', 'pid', 'uri.type', 'rpc.host' ],
      //     'dps': {
      //       '1532671200': 1824.0
      //     },
      //     'sdps': { }
      //   }, {
      //     'metric': 'uri.count',
      //     'tags': {
      //       'service': 'mobAttention',
      //       'uri.type': '1',
      //       'model.type': '1',
      //       'model.id': 'queue_2',
      //       'ips': '116.31.122.25',
      //       'key': '3110_231',
      //       'group': '28'
      //     },
      //     'aggregateTags': [ 'ports', 'pid' ],
      //     'dps': {
      //       '1532671200': 3202.0
      //     },
      //     'sdps': { }
      //   }, {
      //     'metric': 'uri.count',
      //     'tags': {
      //       'service': 'mobAttention',
      //       'ips': '116.31.122.25',
      //       'key': '3110_231%2B17%3C%3C8%7C177',
      //       'group': '28'
      //     },
      //     'aggregateTags': [ 'model.type', 'model.id', 'ports', 'pid', 'uri.type', 'rpc.host' ],
      //     'dps': {
      //       '1532671200': 372.0
      //     },
      //     'sdps': { }
      //   }, {
      //     'metric': 'uri.count',
      //     'tags': {
      //       'service': 'mobAttention',
      //       'ips': '116.31.122.25',
      //       'key': '3110_231%2Bbatch_get_user_logo_info',
      //       'group': '28'
      //     },
      //     'aggregateTags': [ 'model.type', 'model.id', 'ports', 'pid', 'uri.type', 'rpc.host' ],
      //     'dps': {
      //       '1532671200': 322.0
      //     },
      //     'sdps': { }
      //   }, {
      //     'metric': 'uri.count',
      //     'tags': {
      //       'service': 'mobAttention',
      //       'ips': '116.31.122.25',
      //       'key': '3110_231%2B15%3C%3C8%7C177',
      //       'group': '28'
      //     },
      //     'aggregateTags': [ 'model.type', 'model.id', 'ports', 'pid', 'uri.type', 'rpc.host' ],
      //     'dps': {
      //       '1532671200': 330.0
      //     },
      //     'sdps': { }
      //   } ]
      // }
      // data.results.forEach((item) => {
      //   // let metricName = ''
      //   Object.keys(item.dps).forEach((key) => {
      //     let value = item.dps[key]
      //     Math.round(value * 100) / 100
      //     Math.round(value * 100) / 100
      //     let point = {
      //       x: parseInt(key) * 1000,
      //       y: Math.round(value * 100) / 100,
      //       timeScale: timeScale
      //     }
      //     serie.data.push(point)
      //   })
      //   series.push(serie)
      // })
      // this.metricList
      // $common.renderGrid({
      //   params: {
      //     metric: 'uri.count',
      //     startDate: this.startDate,
      //     endDate: this.endDate,
      //     uri: '3110_231*',
      //     aggregator: 'zimsum'
      //   },
      //   grid: this.metricList
      // })
    },
    onItemClick () {
      console.log('on item click')
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
.grid-center {
  display: block;
  text-align: center;
  color: #666;
}
.grid-left {
  display: block;
  text-align: left;
  color: #666;
}
.weui-grids {
  background-color: #fff;
}
</style>
