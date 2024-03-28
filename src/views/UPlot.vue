<template>
  <div>
    <div v-if="opts">
      <UPlotVue :data="data1" :options="opts" />
    </div>
    <div v-if="opts2" class="mt-30">
      <UPlotVue :data="data2" :options="opts2" />
    </div>
    <div v-if="opts3" class="mt-30">
      <UPlotVue :data="data3" :options="opts3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UPlotVue from 'uplot-vue'
import { onMounted, ref } from 'vue'
import uPlot from 'uPlot'

let data1 = ref<uPlot.AlignedData>([])
let data2 = ref<uPlot.AlignedData>([])
let data3 = ref<uPlot.AlignedData>([])

let opts = ref<uPlot.Options>()
let opts2 = ref<uPlot.Options>()
let opts3 = ref<uPlot.Options>()

const round2 = (val) => Math.round(val * 100) / 100

const round3 = (val) => Math.round(val * 1000) / 1000

function prepData(packed) {
  console.time('prep')

  // epoch,idl,recv,send,read,writ,used,free

  const numFields = packed[0]

  packed = packed.slice(numFields + 1)

  // 55,550 data points x 3 series = 166,650
  let data = [
    Array(packed.length / numFields),
    Array(packed.length / numFields),
    Array(packed.length / numFields),
    Array(packed.length / numFields)
  ]

  for (let i = 0, j = 0; i < packed.length; i += numFields, j++) {
    data[0][j] = packed[i] * 60
    data[1][j] = round3(100 - packed[i + 1])
    data[2][j] = round2((100 * packed[i + 5]) / (packed[i + 5] + packed[i + 6]))
    data[3][j] = packed[i + 3]
  }

  console.timeEnd('prep')

  return data
}

function makeChart(data) {
  // 数据分割
  function sliceData(start, end) {
    let d = []

    for (let i = 0; i < data.length; i++) {
      d.push(data[i].slice(start, end))
    }

    return d
  }

  let makeFmt = (suffix) => (u, v, sidx, didx) => {
    if (didx == null) {
      let d = u.data[sidx]
      v = d[d.length - 1]
    }

    return v == null ? null : v.toFixed(1) + suffix
  }

  opts.value = {
    title: '固定长度/滑动数据切片',
    width: 1400,
    height: 600,
    cursor: {
      drag: {
        setScale: false
      }
    },
    // select: {
    //   show: false
    // },

    // series 保存了每一个数据集的配置
    series: [
      // x轴
      {
        // console.log(`uPlot实例:${u}`, `数值:${v}`, `所处数据集下标：${sidx}`, didx)
        value: (u, v, sidx, didx) => {
          if (didx == null) {
            let d = u.data[sidx]
            v = d[d.length - 1]
          }

          return v
        }
      },
      // {},
      // 第一个数据集
      {
        label: 'CPU',
        scale: '%', // 不同单位的series可以通过设置scale绘制不同的y轴
        // width: 2, //线条的宽度
        // spanGaps: true, //是否跳过没有值的点
        value: makeFmt('%'),
        stroke: 'red' // 线条颜色
      },
      // 第二个数据集
      {
        label: 'RAM',
        scale: '%',
        value: makeFmt('%'),
        stroke: 'blue' // 线条颜色
      },
      // 第三个数据集
      {
        label: 'TCP Out',
        scale: 'mb',
        value: makeFmt('MB'),
        stroke: 'green' // 线条颜色
      }
    ],

    // 根据scales渲染刻度、数值、标签及网格
    axes: [
      {},
      {
        scale: '%',
        //values: 格式化刻度标签的数组
        //格式一: ticks：沿轴刻度的原始值数组 space: CSS像素中确定的刻度间隔
        values: (self, ticks, space) => ticks.map((v) => +v.toFixed(1) + '%')
        // 格式二：带有断点的刻度格式化程序数组
        // values: [
        //  [3600 * 24 * 365, '{YYYY}', null, null, null, null, null, null, 1]
        // ]
      },
      {
        side: 1, // 放置轴的位置 0: top, 1: right, 2: bottom, 3: left

        scale: 'mb',
        values: (u, ticks, space) => ticks.map((v) => +v.toFixed(2) + ' MB'),
        grid: { show: false }
      }
    ]
  }

  opts2.value = {
    title: '增加长度数据',
    width: 1400,
    height: 600,
    cursor: {
      drag: {
        setScale: false
      }
    },
    series: [
      {},
      {
        label: 'CPU',
        scale: '%',
        value: (u, v) => (v == null ? null : v.toFixed(1) + '%'),
        stroke: 'red'
      },
      {
        label: 'RAM',
        scale: '%',
        value: (u, v) => (v == null ? null : v.toFixed(1) + '%'),
        stroke: 'blue'
      },
      {
        label: 'TCP Out',
        scale: 'mb',
        value: (u, v) => (v == null ? null : v.toFixed(2) + ' MB'),
        stroke: 'green'
      }
    ],
    axes: [
      {},
      {
        scale: '%',
        values: (u, vals, space) => vals.map((v) => +v.toFixed(1) + '%')
      },
      {
        side: 1,
        scale: 'mb',
        values: (u, vals, space) => vals.map((v) => +v.toFixed(2) + ' MB'),
        grid: { show: false }
      }
    ]
  }

  opts3.value = {
    title: '增加长度数据，静态x比例',
    width: 1400,
    height: 600,
    cursor: {
      drag: {
        setScale: false
      }
    },
    // select: {
    //   show: false
    // },
    scales: {
      x: {
        auto: false,
        range: (min, max) => [1566453600, 1566813540]
      },
      '%': {
        auto: false,
        range: (min, max) => [0, 100]
      },
      mb: {
        auto: false,
        range: (min, max) => [0, 70]
      }
    },
    series: [
      {},
      {
        label: 'CPU',
        scale: '%',
        value: (u, v) => (v == null ? null : v.toFixed(1) + '%'),
        stroke: 'red'
      },
      {
        label: 'RAM',
        scale: '%',
        value: (u, v) => (v == null ? null : v.toFixed(1) + '%'),
        stroke: 'blue'
      },
      {
        label: 'TCP Out',
        scale: 'mb',
        value: (u, v) => (v == null ? null : v.toFixed(2) + ' MB'),
        stroke: 'green'
      }
    ],
    axes: [
      {},
      {
        scale: '%',
        values: (u, vals, space) => vals.map((v) => +v.toFixed(1) + '%')
      },
      {
        side: 1,
        scale: 'mb',
        values: (u, vals, space) => vals.map((v) => +v.toFixed(2) + ' MB'),
        grid: { show: false }
      }
    ]
  }

  let interval = 20

  let start1 = 0
  let len1 = 3000

  data1.value = sliceData(start1, start1 + len1)

  setInterval(function () {
    start1 += 10
    data1.value = sliceData(start1, start1 + len1)
  }, interval)

  let start2 = 0
  let len2 = 3000

  data2.value = sliceData(start2, start2 + len2)

  setInterval(function () {
    len2 += 10
    data2.value = sliceData(start2, start2 + len2)
  }, interval)

  let start3 = 0
  let len3 = 10

  data3.value = sliceData(start3, start3 + len3)

  setInterval(function () {
    len3 += 10
    data3.value = sliceData(start3, start3 + len3)
  }, interval)
}
onMounted(async () => {
  const result = await fetch('/json/data.json')

  const packed = await result.json()
  let data = prepData(packed)
  setTimeout(() => makeChart(data), 0)
})
</script>
