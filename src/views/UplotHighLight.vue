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
let can = document.createElement('canvas')
let ctx = can.getContext('2d')
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

function scaleGradient(u, scaleKey, ori, scaleStops, discrete = false) {
  let scale = u.scales[scaleKey]

  // we want the stop below or at the scaleMax
  // and the stop below or at the scaleMin, else the stop above scaleMin
  let minStopIdx
  let maxStopIdx

  for (let i = 0; i < scaleStops.length; i++) {
    let stopVal = scaleStops[i][0]

    if (stopVal <= scale.min || minStopIdx == null) minStopIdx = i

    maxStopIdx = i

    if (stopVal >= scale.max) break
  }

  if (minStopIdx == maxStopIdx) return scaleStops[minStopIdx][1]

  let minStopVal = scaleStops[minStopIdx][0]
  let maxStopVal = scaleStops[maxStopIdx][0]

  if (minStopVal == -Infinity) minStopVal = scale.min

  if (maxStopVal == Infinity) maxStopVal = scale.max

  let minStopPos = u.valToPos(minStopVal, scaleKey, true)
  let maxStopPos = u.valToPos(maxStopVal, scaleKey, true)

  let range = minStopPos - maxStopPos

  let x0, y0, x1, y1

  if (ori == 1) {
    x0 = x1 = 0
    y0 = minStopPos
    y1 = maxStopPos
  } else {
    y0 = y1 = 0
    x0 = minStopPos
    x1 = maxStopPos
  }

  let grd = ctx.createLinearGradient(x0, y0, x1, y1)

  let prevColor

  for (let i = minStopIdx; i <= maxStopIdx; i++) {
    let s = scaleStops[i]

    let stopPos =
      i == minStopIdx ? minStopPos : i == maxStopIdx ? maxStopPos : u.valToPos(s[0], scaleKey, true)
    let pct = (minStopPos - stopPos) / range

    if (discrete && i > minStopIdx) grd.addColorStop(pct, prevColor)

    grd.addColorStop(pct, (prevColor = s[1]))
  }

  return grd
}

let hzGrad = [
  [0, 'blue'],
  [3, 'red'],
  [7, 'blue'],
  [10, 'red'],
  [15, 'blue']
]

let hzGradFill = [
  [0, '#ffffff00'],
  [10, 'red'],
  [15, '#ffffff00']
]
function makeChart() {
  console.time('chart')

  opts.value = {
    title: 'Scale-aligned gradient strokes (hz)',
    width: 800,
    height: 600,
    legend: {
      markers: {
        stroke: 'red'
      }
    },
    plugins: [wheelZoomPlugin()],
    cursor: {
      points: {
        fill: (u, seriesIdx) => {
          let xIdx = u.cursor.idxs[0]

          if (xIdx != null) {
            let val = u.data[0][u.cursor.idxs[0]]

            for (let i = 0; i < hzGrad.length; i++) {
              let nextStop = hzGrad[i + 1]

              if (nextStop == null || val < nextStop[0]) return hzGrad[i][1]
            }
          }
          return 'black'
        }
      }
    },
    scales: {
      x: {
        time: false,
        max: 18,
        min: 3
      }
    },
    series: [
      {},
      {
        label: 'Trends',
        width: 1,
        stroke: (u, seriesIdx) => {
          return scaleGradient(u, 'x', 0, hzGrad, true)
        }
        // fill:(u, seriesIdx) => {
        //   return scaleGradient(u, 'x', 0, hzGradFill, true);
        // }
      }
    ]
  }

  data.value = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21],
    [12, 20, 29, 40, 43, 60, 65, 71, 73, 80, 72, 84, 68, 76, 84, 57, 15, 78, 45, 13, 18]
  ]

  console.timeEnd('chart')
}

onMounted(() => {
  makeChart()
})
</script>
