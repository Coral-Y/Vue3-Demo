<template>
  <div v-if="data" class="flex flex-wrap justify-around">
    <div class="flex flex-col items-center">
      <UPlotVue :data="data" :options="opt1" ref="uRange" />
      <UPlotVue :data="data" :options="opt2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UPlotVue from 'uplot-vue'
import { ref } from 'vue'
import uPlot from 'uPlot'

let uRange = ref()

let length = 20

let data = ref<uPlot.AlignedData>([
  Array.from({ length }, (x, i) => i + 1),
  [40, 43, 60, 65, 71, 73, 80, 72, 84, 68, 76, 84, 57, 45, 13, 48, 96, 14, 36, 12]
])

// 滚轮滚动
function wheelScrollPlugin() {
  return {
    hooks: {
      ready: (u) => {
        //.u-over dom element
        let over = u.over

        let scXMin0 = u.scales.x.min
        let scXMax0 = u.scales.x.max

        // wheel scroll
        over.addEventListener('wheel', (e) => {
          e.preventDefault()

          let dx = 0.01 * e.deltaY
          let newScXMin = scXMin0 + dx
          let newScXMax = scXMax0 + dx
          if (newScXMin <= 0 || newScXMax > length) {
            return
          }
          // 设置比例限制及重绘
          u.setScale('x', {
            min: newScXMin,
            max: newScXMax
          })
          scXMin0 = newScXMin
          scXMax0 = newScXMax

          let left = Math.round(uRange.value._chart.valToPos(newScXMin, 'x'))
          uRange.value._chart.setSelect({ left }, false)
        })
      }
    }
  }
}

// 整体浏览效果
let initXmin = 3 // 初始显示最小值
let initXmax = 13 // 初始显示最大值
let opt1 = ref<uPlot.Options>({
  title: '滚轮滚动整体预览效果',
  width: 800,
  height: 100,
  // 数据集配置
  series: [
    {},
    {
      stroke: 'red'
    }
  ],
  cursor: {
    y: false, // 是否显示y轴刻度辅助线
    drag: {
      setScale: false, // 鼠标拖动时是否触发重置scale
      x: false, // x轴是否可以拖拽
      y: false // y轴是否可以拖拽
    },
    sync: {
      key: 'moo' // 多个图表通过同一个key值 实现鼠标同步
    },
    bind: {
      dblclick: () => null, // 去除默认双击还原事件(缩放或平移时)
      mousedown: () => null // 去除点击取消选中效果的功能
    }
  },
  legend: {
    show: false
  },
  scales: {
    x: {
      time: false
    }
  },
  hooks: {
    ready: [
      (uRanger) => {
        let left = Math.round(uRanger.valToPos(initXmin, 'x'))
        let width = Math.round(uRanger.valToPos(initXmax, 'x')) - left
        let height = uRanger.bbox.height
        uRanger.setSelect({ left, width, height }, false)
      }
    ]
  }
})

let opt2 = ref<uPlot.Options>({
  width: 600,
  height: 400,
  cursor: {
    drag: {
      setScale: false,
      x: false,
      y: false
    },
    sync: {
      key: 'moo'
    },
    bind: {
      dblclick: () => null // 去除默认双击还原事件(缩放或平移时)
    }
  },
  plugins: [wheelScrollPlugin()],
  select: {
    over: false
  },
  scales: {
    x: {
      time: false,
      min: initXmin,
      max: initXmax
    }
  },
  legend: {
    show: false
  },
  series: [
    {},
    {
      stroke: 'red'
    }
  ]
})
</script>
