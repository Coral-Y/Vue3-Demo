<template>
  <div ref="chart" style="width: 600px; height: 400px">echart</div>
</template>

<script setup lang="ts">
import { onMounted, ref ,onUnmounted} from 'vue'
import * as echarts from 'echarts'


const chart = ref(null)
const myChart = ref()
let data = []
let option = {
  xAxis: {
    data: Array.from({ length: 1000 }, (x, i) => i)
  },
  yAxis: {
   
  },
  series: [
    {
      data:  [],
      showSymbol:false,
      type: 'line'
    }
  ]
};

let timer1
onMounted(async() => {
  myChart.value = echarts.init(chart.value)
  const result = await fetch('/json/data1.json')
  const packed = await result.json()

  // for (var i = 0; i < 1000; i++) {
  //   data.push(randomData(packed.data))
  // }
  let start=0
  option && myChart.value.setOption(option)
  timer1=setInterval(function () {
    data=packed.data.slice(start,start+1000)
    start+=10
    myChart.value.setOption({
      series: [
        {
          data: data
        }
      ]
    })
  }, 20)
})

onUnmounted(()=>{
  clearTimeout(timer1)
  timer1=null
})

let now = new Date(1997, 9, 3)
let oneDay = 24 * 3600 * 1000
let value = Math.random() * 1000
let index = 0
function randomData(packetdata) {
  now = new Date(+now + oneDay)
  value=packetdata[index]
  index++
  // value = value + Math.random() * 21 - 10
  return {
    name: now.toString(),
    value: [[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'), value]
  }
}
</script>
