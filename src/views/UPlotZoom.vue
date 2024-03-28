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
        xMin = u.scales.x.min // x轴的最小值
        xMax = u.scales.x.max // x轴的最大值
        yMin = u.scales.y.min // y轴的最小值
        yMax = u.scales.y.max // y轴的最大值

        xRange = xMax - xMin // x轴数据范围
        yRange = yMax - yMin // y轴数据范围

        console.log(xMin, xMax, yMin, yMax, xRange, yRange)

        //.u-over dom element
        let over = u.over
        // 返回一个DOMRect对象，该对象是一个将范围内所有元素的边界矩形包围起来的矩形。用于确认文本区域中选中部分或光标的视窗坐标
        let rect = over.getBoundingClientRect()

        let left0
        let scXMin0 = u.scales.x.min
        let scXMax0 = u.scales.x.max

        // posToVal：将相对于绘图区域的CSS像素位置转换为沿给定比例的值
        let xUnitsPerPx = u.posToVal(1, 'x') - u.posToVal(0, 'x')
        console.log(`xUnitsPerPx: ${xUnitsPerPx}`)

        function onmove(e) {
          e.preventDefault()

          let left1 = e.clientX
          //	let top1 = e.clientY;

          let dx = xUnitsPerPx * (left1 - left0)
          console.log(`dx: ${dx}`)

          // 设置比例限制及重绘
          u.setScale('x', {
            min: scXMin0 - dx,
            max: scXMax0 - dx
          })
        }

        function onup() {
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
          let scXMin0 = u.scales.x.min
          let scXMax0 = u.scales.x.max

          console.log(e.deltaY)

          let dx = 0.01 * e.deltaY
          // 设置比例限制及重绘
          u.setScale('x', {
            min: scXMin0 - dx,
            max: scXMax0 - dx
          })

          // 光标状态和选项
          // let { left, top } = u.cursor
          // console.log(left, top)

          // let leftPct = left / rect.width
          // let btmPct = 1 - top / rect.height
          // let xVal = u.posToVal(left, 'x')
          // let yVal = u.posToVal(top, 'y')
          // let oxRange = u.scales.x.max - u.scales.x.min
          // let oyRange = u.scales.y.max - u.scales.y.min

          // let nxRange = e.deltaY < 0 ? oxRange * factor : oxRange / factor
          // let nxMin = xVal - leftPct * nxRange
          // let nxMax = nxMin + nxRange
          // ;[nxMin, nxMax] = clamp(nxRange, nxMin, nxMax, xRange, xMin, xMax)

          // let nyRange = e.deltaY < 0 ? oyRange * factor : oyRange / factor
          // let nyMin = yVal - btmPct * nyRange
          // let nyMax = nyMin + nyRange
          // ;[nyMin, nyMax] = clamp(nyRange, nyMin, nyMax, yRange, yMin, yMax)

          // // 手动批处理多个操作
          // u.batch(() => {
          //   u.setScale('x', {
          //     min: nxMin,
          //     max: nxMax
          //   })

          //   u.setScale('y', {
          //     min: nyMin,
          //     max: nyMax
          //   })
          // })
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
    // 视图中可见的最大最小范围
    scales: {
      x: {
        time: false
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
