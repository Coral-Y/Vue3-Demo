<template>
  <div>
    <div v-if="opts1">
      <UPlotVue :data="uplotData1" :options="opts1" />
    </div>
    <div v-if="opts2">
      <UPlotVue :data="uplotData2" :options="opts2" />
    </div>
    <div v-if="opts3">
      <UPlotVue :data="uplotData3" :options="opts3" />
    </div>
    <div v-if="opts4">
      <UPlotVue :data="uplotData4" :options="opts4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UPlotVue from 'uplot-vue'
import uPlot from 'uPlot'

let yNiceScale
let yMaxTicks = 10
let yMinSpace = 30
let yDataMin, yDataMax

let uplotData1 = ref<uPlot.AlignedData>([
  [0, 1, 2, 3, 4, 5],
  [-5, -2, 1, 7, 9, 13],
  [-123, 4, 29, 37, 217, 230],
  [0.5, 0.1, -7, -9, -13, 1]
])
let uplotData2 = ref<uPlot.AlignedData>([]) // 每个数据点间隔1小时
let uplotData3 = ref<uPlot.AlignedData>([])
let uplotData4 = ref<uPlot.AlignedData>([])

let opts1 = ref<uPlot.Options>({
  width: 1700,
  height: 400,
  scales: {
    x: {
      time: false
    },
    y: {
      // rescale on setSize if incrs is dynamic?
      // this does change with resize but should in case the range is expanded for niceness
      range: (u, dataMin, dataMax) => {
        // if non-zero min or max, grow each by 2% to provide scale padding
        dataMin *= dataMin < 0 ? 1.02 : dataMin > 0 ? 0.98 : 1
        dataMax *= dataMax < 0 ? 0.98 : dataMax > 0 ? 1.02 : 1

        yDataMin = dataMin
        yDataMax = dataMax

        yMaxTicks = Math.floor(u.bbox.height / devicePixelRatio / yMinSpace)
        yNiceScale = niceScale(dataMin, dataMax, yMaxTicks)
        return [yNiceScale.min, yNiceScale.max]
      }
    }
  },
  axes: [
    {},
    {
      incrs: (u) => {
        yMaxTicks = Math.floor(u.bbox.height / devicePixelRatio / yMinSpace)

        let _yNiceScale = niceScale(yDataMin, yDataMax, yMaxTicks)

        if (_yNiceScale.min != yNiceScale.min || _yNiceScale.max != yNiceScale.max) {
          console.log('rescale y!')

          queueMicrotask(() => {
            u.setScale('y', yNiceScale)
          })
        }

        yNiceScale = _yNiceScale

        return [yNiceScale.incr]
      },
      space: yMinSpace,
      size: 110
    }
  ],
  series: [
    {},
    {
      stroke: 'red',
      fill: 'rgba(255,0,0,0.1)'
    },
    {
      stroke: 'green',
      fill: 'rgba(0,255,0,0.1)'
    },
    {
      stroke: 'blue',
      fill: 'rgba(0,0,255,0.1)'
    }
  ]
})
let opts2 = ref<uPlot.Options>()
let opts3 = ref<uPlot.Options>()
let opts4 = ref<uPlot.Options>()

function niceScale(dataMin, dataMax, maxTicks) {
  let range = niceNum(dataMax - dataMin, false)

  let incr = niceNum(range / (maxTicks - 1), true)

  return {
    //	dec,  // num decimals needed for tick differentiation
    incr,
    min: Math.floor(dataMin / incr) * incr,
    max: Math.ceil(dataMax / incr) * incr
  }
}

function niceNum(delta, round) {
  let exp = Math.floor(Math.log10(delta))
  let frac = delta / Math.pow(10, exp)

  let niceFrac = round
    ? frac < 1.5
      ? 1
      : frac < 3
        ? frac > 2.25
          ? 2.5
          : 2
        : frac < 7
          ? 5
          : 10
    : frac <= 1
      ? 1
      : frac <= 2
        ? 2
        : frac <= 5
          ? 5
          : 10

  return niceFrac * Math.pow(10, exp)
}
</script>
