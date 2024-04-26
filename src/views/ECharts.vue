<template>
  <div ref="chart" style="width: 600px; height: 400px">echart</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const chart = ref(null)
const myChart = ref()
let data = []
let option = {
  title: {
    text: 'Dynamic Data & Time Axis'
  },
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      params = params[0]
      var date = new Date(params.name)
      return (
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' : ' +
        params.value[1]
      )
    },
    axisPointer: {
      animation: false
    }
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    splitLine: {
      show: false
    }
  },
  series: [
    {
      name: 'Fake Data',
      type: 'line',
      showSymbol: false,
      data: data
    }
  ]
}

onMounted(() => {
  myChart.value = echarts.init(chart.value)

  console.log(chart.value)
  console.log(myChart.value)

  for (var i = 0; i < 1000; i++) {
    data.push(randomData())
  }
  option && myChart.value.setOption(option)

  setInterval(function () {
    for (var i = 0; i < 5; i++) {
      data.shift()
      data.push(randomData())
    }
    myChart.value.setOption({
      series: [
        {
          data: data
        }
      ]
    })
  }, 1000)
})

let now = new Date(1997, 9, 3)
let oneDay = 24 * 3600 * 1000
let value = Math.random() * 1000
function randomData() {
  now = new Date(+now + oneDay)
  value = value + Math.random() * 21 - 10
  return {
    name: now.toString(),
    value: [[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'), Math.round(value)]
  }
}
</script>
