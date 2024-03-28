<template>
  <div>
    <div v-if="opts">
      <UPlotVue :data="data" :options="opts" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UPlotVue from 'uplot-vue'
import { onMounted, ref } from 'vue'
import uPlot from 'uPlot'

let data = ref<uPlot.AlignedData>([])

let opts = ref<uPlot.Options>()

function wheelZoomPlugin() {
  return {
    hooks: {
      ready: (u) => {
        //.u-over dom element
        let over = u.over

        let scXMin0 = u.scales.x.min
        let scXMax0 = u.scales.x.max

        console.log(scXMin0, scXMax0)

        // posToVal：将相对于绘图区域的CSS像素位置转换为沿给定比例的值
        let xUnitsPerPx = u.posToVal(1, 'x') - u.posToVal(0, 'x')
        console.log(`xUnitsPerPx: ${xUnitsPerPx}`)

        // wheel scroll zoom
        over.addEventListener('wheel', (e) => {
          e.preventDefault()

          let dx = 0.01 * e.deltaY
          let newScXMin = scXMin0 - dx
          let newScXMax = scXMax0 - dx
          // 设置比例限制及重绘
          u.setScale('x', {
            min: newScXMin,
            max: newScXMax
          })
          scXMin0 = newScXMin
          scXMax0 = newScXMax
        })
      }
    }
  }
}

function makeChart() {
  console.time('chart')

  opts.value = {
    title: '拖拽及滚轮缩放',
    width: 600,
    height: 400,
    plugins: [wheelZoomPlugin()],
    // 视图中可见的最大最小范围
    scales: {
      x: {
        time: false,
        min: 4,
        max: 10
      }
      //	y: {
      //		auto: false,
      //	}
    },
    // 数据集配置
    series: [
      {},
      {
        label: 'One',
        stroke: 'red'
      }
    ]
  }

  data.value = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    [40, 43, 60, 65, 71, 73, 80, 72, 84, 68, 76, 84, 57]
  ]

  console.timeEnd('chart')
}

onMounted(() => {
  makeChart()
})
</script>
