<template>
  <div>
    <div ref="shenzhen" style="width: 1600px; height: 800px" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

// 深圳市地图
const shenzhen = ref(null)
const myShenzhenChart = ref()
const shenzhenOption = {
  title: {
    text: '深圳市地图',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  visualMap: {
    min: 0,
    max: 1000,
    left: 'left',
    top: 'bottom',
    text: ['高', '低'],
    calculable: true
  },
  series: [
    {
      name: '深圳市',
      type: 'map',
      map: 'shenzhen',
      label: {
        show: true
      },
      data: []
    }
  ]
}

onMounted(async () => {
  const result = await fetch('/json/shenzhen.json')

  const shenzhenJson = await result.json()
  echarts.registerMap('shenzhen', shenzhenJson)

  myShenzhenChart.value = echarts.init(shenzhen.value)
  shenzhenOption && myShenzhenChart.value.setOption(shenzhenOption)
})
</script>
