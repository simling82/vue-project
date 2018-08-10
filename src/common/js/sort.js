export default {
  sort: function (series) {
    let array = []
    let result = []
    let uriMap = new Map()
    // 构造排序需要的数据格式
    for (var i = 0; i < series.length; i++) {
      var uriItem = series[i]
      var value = 0
      var key = uriItem.name
      uriMap.set(key, uriItem)
      var data = uriItem.data
      for (var j = 0; j < data.length; j++) {
        value += data[j].y || 0
      }
      array.push(this.getUriObject(key, value, 0))
    }
    // console.log('输入数据：')
    // console.log(series)
    // console.log('排序前：')
    // console.log(array)
    let uriMsgArray = new this.UrlSort(array).sortByUriAndVal()
    // 得到有顺序的uri后，series按当前排好的uri顺序排序
    for (let i = 0; i < uriMsgArray.length; i++) {
      let uri = uriMsgArray[i].uri
      result.push(uriMap.get(uri))
    }
    // console.log('排序后：')
    // console.log(uriMsgArray)
    // console.log('输出结果：')
    // console.log(result)
    return result
  },
  getUriObject (uri, val, syn) {
    return {
      'uri': uri,
      'val': val,
      'syn': syn
    }
  },
  UrlSort: function (array) {
    this.array = array
    this.uriSet = new Set()
    this.resultArray = []
    this.resultSet = new Set()
    this.lenArray = []

    this.sortByUriAndVal = function () {
      this.array.sort(function (a, b) {
        return b.val - a.val
      })
      for (var i = 0; i < this.array.length; i++) {
        var item = this.array[i]
        this.uriSet.add(item.uri)
        this.lenArray.push(item)
      }
      // 按+号数排序，相同加号数就看值排序
      this.lenArray.sort(function (a, b) {
        var aLen = a.uri.split('+').length - 1
        var bLen = b.uri.split('+').length - 1
        var result = aLen - bLen
        if (result === 0) {
          result = b.val - a.val
        }
        return result
      })

      for (let i = 0; i < this.array.length; i++) {
        let item = this.array[i]
        var uri = item.uri
        if (!this.resultSet.has(uri)) {
          var root = this.getParentUri(uri)
          this.resultArray.push(item)
          this.resultSet.add(uri)
          this.getChildenUri(uri)
          if (root) {
            this.getChildenUri(root)
          }
        }
      }
      addMsg(this.resultArray)
      return this.resultArray
    }

    // 判断URI的异步及回调情况
    function addMsg (sortedArray) {
      let lastVal = null
      sortedArray.forEach(function (val, index) {
        if (val.syn === 1) {
          val.msg = '异步'
        } else {
          if (lastVal != null && lastVal.syn === 1) {
            let lastUri = lastVal.uri
            let curUri = val.uri
            var lastIndex = curUri.lastIndexOf('+')
            if (lastIndex > 0) {
              var subCurUri = curUri.substring(0, lastIndex)
              if (subCurUri === lastUri) {
                val.msg = '回调'
              }
            }
          }
        }
        lastVal = val
      })
    }

    this.getParentUri = function (uri) {
      var root = null
      for (var i = 0; i < this.lenArray.length; i++) {
        var item = this.lenArray[i]
        var itemUri = item.uri
        if (!this.resultSet.has(itemUri) && this.preEqual(uri, itemUri)) {
          if (!root) {
            root = itemUri
          }
          this.resultArray.push(item)
          this.resultSet.add(itemUri)
        }
      }
      return root
    }

    this.getChildenUri = function (uri) {
      for (var i = 0; i < this.lenArray.length; i++) {
        var item = this.lenArray[i]
        var itemUri = item.uri
        if (this.preEqual(itemUri, uri) && !this.resultSet.has(itemUri)) {
          this.resultArray.push(item)
          this.resultSet.add(itemUri)
          this.getChildenUri(itemUri)
        }
      }
    }
    this.preEqual = function (str, preStr) {
      preStr += '+'
      var result = false
      if (str != null && preStr != null) {
        var len1 = str.length
        var len2 = preStr.length
        if (len1 >= len2) {
          var newStr = str.substr(0, len2)
          if (newStr === preStr) {
            result = true
          }
        }
      }

      return result
    }
  }
}
