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

function wheelZoomPlugin(opts) {
  let factor = opts.factor || 0.75

  let xMin, xMax, yMin, yMax, xRange, yRange

  function clamp(nRange, nMin, nMax, fRange, fMin, fMax) {
    if (nRange > fRange) {
      nMin = fMin
      nMax = fMax
    } else if (nMin < fMin) {
      nMin = fMin
      nMax = fMin + nRange
    } else if (nMax > fMax) {
      nMax = fMax
      nMin = fMax - nRange
    }

    return [nMin, nMax]
  }

  return {
    hooks: {
      ready: (u) => {
        xMin = u.scales.x.min
        xMax = u.scales.x.max
        yMin = u.scales.y.min
        yMax = u.scales.y.max

        xRange = xMax - xMin
        yRange = yMax - yMin

        let over = u.over
        let rect = over.getBoundingClientRect()

        let left0
        let scXMin0 = u.scales.x.min
        let scXMax0 = u.scales.x.max

        let xUnitsPerPx = u.posToVal(1, 'x') - u.posToVal(0, 'x')

        function onmove(e) {
          e.preventDefault()

          let left1 = e.clientX
          //	let top1 = e.clientY;

          let dx = xUnitsPerPx * (left1 - left0)

          u.setScale('x', {
            min: scXMin0 - dx,
            max: scXMax0 - dx
          })
        }

        function onup(e) {
          document.removeEventListener('mousemove', onmove)
          document.removeEventListener('mouseup', onup)
        }
        // wheel drag pan
        over.addEventListener('mousedown', (e) => {
          if (e.button == 1) {
            //	plot.style.cursor = "move";
            e.preventDefault()

            left0 = e.clientX
            //	let top0 = e.clientY;

            document.addEventListener('mousemove', onmove)
            document.addEventListener('mouseup', onup)
          }
        })

        // wheel scroll zoom
        over.addEventListener('wheel', (e) => {
          e.preventDefault()

          let { left, top } = u.cursor

          let leftPct = left / rect.width
          let btmPct = 1 - top / rect.height
          let xVal = u.posToVal(left, 'x')
          let yVal = u.posToVal(top, 'y')
          let oxRange = u.scales.x.max - u.scales.x.min
          let oyRange = u.scales.y.max - u.scales.y.min

          let nxRange = e.deltaY < 0 ? oxRange * factor : oxRange / factor
          let nxMin = xVal - leftPct * nxRange
          let nxMax = nxMin + nxRange
          ;[nxMin, nxMax] = clamp(nxRange, nxMin, nxMax, xRange, xMin, xMax)

          let nyRange = e.deltaY < 0 ? oyRange * factor : oyRange / factor
          let nyMin = yVal - btmPct * nyRange
          let nyMax = nyMin + nyRange
          ;[nyMin, nyMax] = clamp(nyRange, nyMin, nyMax, yRange, yMin, yMax)

          u.batch(() => {
            u.setScale('x', {
              min: nxMin,
              max: nxMax
            })

            u.setScale('y', {
              min: nyMin,
              max: nyMax
            })
          })
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
    plugins: [wheelZoomPlugin({ factor: 0.75 })],
    scales: {
      x: {
        time: false
      }
      //	y: {
      //		auto: false,
      //	}
    },
    series: [
      {},
      {
        label: 'One',
        stroke: 'red'
      },
      {
        label: 'Two',
        stroke: 'blue'
      }
    ]
  }

  data.value = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [40, 43, 60, 65, 71, 73, 80, 72, 84, 68],
    [18, 24, 37, 55, 55, 60, 63, 65, 68, 65]
  ]

  console.timeEnd('chart')
}

onMounted(() => {
  makeChart()
})
</script>
