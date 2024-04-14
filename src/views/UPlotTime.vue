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
import UPlotVue from 'uplot-vue'
import { onMounted, ref } from 'vue'
import uPlot from 'uPlot'
import dayjs from 'dayjs'

let uplotData1 = ref<uPlot.AlignedData>([])
let uplotData2 = ref<uPlot.AlignedData>([]) // 每个数据点间隔1小时
let uplotData3 = ref<uPlot.AlignedData>([])
let uplotData4 = ref<uPlot.AlignedData>([])

let opts1 = ref<uPlot.Options>()
let opts2 = ref<uPlot.Options>()
let opts3 = ref<uPlot.Options>()
let opts4 = ref<uPlot.Options>()

function aggDays(data): uPlot.AlignedData {
  let data2 = [data[0].slice(), data[1], data[2], data[3]]

  data2[0][0] = 1546300800

  for (let i = 1; i < data2[0].length; i++) data2[0][i] = 1546300800 + i * 3600

  let days = []
  let y19 = []
  let y18 = []
  let y17 = []

  let baseTs = data2[0][0]

  let curTs = baseTs
  let sum17 = 0
  let sum18 = 0
  let sum19 = 0

  let d = 3600 * 24 // get breakpoints

  data2[0].forEach((ts, i) => {
    if (i > 0 && (ts - baseTs) % d == 0) {
      days.push(curTs)
      y19.push(sum19)
      y18.push(sum18)
      y17.push(sum17)

      curTs = ts
      sum19 = data2[1][i]
      sum18 = data2[2][i]
      sum17 = data2[3][i]
    } else {
      sum19 += data2[1][i]
      sum18 += data2[2][i]
      sum17 += data2[3][i]
    }
  })

  days.push(curTs)
  y19.push(sum19)
  y18.push(sum18)
  y17.push(sum17)

  return [days, y19, y18, y17]
}

let longDateHourMin = uPlot.fmtDate('{YYYY}-{MM}-{DD} {h}:{mm}{aa}')

function tsRange(from, qty, incr) {
  let ts = [from]
  while (--qty) ts.push((from += incr))
  return ts
}
const yrHours = 365 * 24
const hrSecs = 3600

console.log(Date.now())
console.log(new Date('2024-04-02T18:59:15.178719').getMilliseconds())

let ts18 = tsRange(new Date(2018, 0) / 1000, yrHours, hrSecs)
let ts17 = tsRange(new Date(2017, 0) / 1000, yrHours, hrSecs)

onMounted(() => {
  const startDate = new Date('2023-01-01T00:00:00Z')
  const endDate = new Date('2023-01-01T00:00:10Z')
  const interval = 500 // 生成固定间隔的时间数组
  const times = []
  for (let t = startDate.getTime(); t < endDate.getTime(); t += interval) {
    times.push(t / 1000)
  }

  // 生成与时间数组对应的随机数据数组
  const data = times.map(() => Math.random() * 100)
  uplotData4.value = [times, data]
  opts4.value = {
    width: 600,
    height: 200,
    scales: {
      x: {
        time: true // 启用时间轴
      },
      y: {
        range: [0, 100]
      }
    },
    series: [
      {
        value: (u: any, v: any) => {
          return v == null ? '-' : dayjs.unix(v).format('YYYY-MM-DD HH:mm:ss:SSS')
        }
      },
      {
        label: '2019',
        stroke: 'rgba(5, 141, 199, 1)'
      }
    ],
    axes: [
      {
        scale: 'x',
        ticks: {
          size: 5
        },
        values: (self, ticks, space) => {
          console.log('aaaaa', ticks, space)
          return ticks.map((v) => dayjs.unix(v).format('ss:SSS'))
        }
      },
      {
        scale: 'y'
      }
    ]
  }

  fetch('./json/traffic.json')
    .then((r) => r.json())
    .then((data) => {
      opts1.value = {
        title: 'Hourly Users',
        //	tzDate: ts => uPlot.tzDate(new Date(ts * 1e3), 'Etc/UTC'),
        //	tzDate: ts => uPlot.tzDate(new Date(ts * 1e3), 'Europe/London'),
        width: 1800,
        height: 200,
        axes: [
          {
            //		space: 100,
          },
          {
            space: 20
          }
        ],
        series: [
          {},
          {
            label: '2019',
            stroke: 'rgba(5, 141, 199, 1)',
            fill: 'rgba(5, 141, 199, 0.1)',
            values: (u, sidx, idx) => {
              if (idx == null) return { Time: '--', Users: '--' }

              //	let date = self.tzDate(data[0][idx]);
              let date = new Date(data[0][idx] * 1e3)

              return {
                Time: longDateHourMin(date),
                Users: data[sidx][idx]
              }
            }
          },
          {
            label: '2018',
            stroke: 'rgba(237, 126, 23, 1)',
            values: (u, sidx, idx) => {
              if (idx == null) return { Time: '--', Users: '--' }

              let date = new Date(ts18[idx] * 1e3)

              return {
                Time: longDateHourMin(date),
                Users: data[sidx][idx]
              }
            }
          },
          {
            label: '2017',
            stroke: 'rgba(255, 0, 0, 1)',
            values: (u, sidx, idx) => {
              if (idx == null) return { Time: '--', Users: '--' }

              let date = new Date(ts17[idx] * 1e3)

              return {
                Time: longDateHourMin(date),
                Users: data[3][idx]
              }
            }
          }
        ]
      }
      uplotData1.value = data

      function padWith0s(arr, len) {
        return arr.concat(Array(len - arr.length).fill(0))
      }

      let jan0 = 0
      let jan1 = 743
      let feb0 = 744
      let feb1 = 1416
      let febLen = feb1 - feb0

      let tsJan = data[0].slice(jan0, jan1)
      let tsFeb = data[0].slice(feb0, feb0 + (jan1 - jan0))

      let data1 = [
        tsFeb,
        padWith0s(data[1].slice(feb0, feb1), jan1 - jan0),
        data[1].slice(jan0, jan1)
      ]

      opts2.value = {
        title: 'Feb vs Jan 2019',
        width: 1800,
        height: 200,
        scales: {
          x2: {
            from: 'x',
            range: (u, min, max) => [min - 3600 * 24 * 31, max - 3600 * 24 * 31]
          }
        },
        axes: [
          {},
          {
            space: 20
          },
          {
            side: 2,
            scale: 'x2',
            grid: { show: false },
            stroke: 'rgba(237, 126, 23, 1)'
          }
        ],
        series: [
          {},
          {
            label: 'Feb 2019',
            stroke: 'rgba(5, 141, 199, 1)',
            fill: 'rgba(5, 141, 199, 0.1)',
            values: (u, sidx, idx) => {
              if (idx == null || idx >= febLen) {
                return {
                  Time: '--',
                  Users: '--'
                }
              }

              let ts = tsFeb[idx]
              let date = new Date(ts * 1e3)

              return {
                Time: longDateHourMin(date),
                Users: data1[sidx][idx]
              }
            }
          },
          {
            label: 'Jan 2019',
            stroke: 'rgba(237, 126, 23, 1)',
            values: (u, sidx, idx) => {
              if (idx == null) return { Time: '--', Users: '--' }

              //	let date = self.tzDate(data[0][idx]);
              let date = new Date(tsJan[idx] * 1e3)

              return {
                Time: longDateHourMin(date),
                Users: data1[sidx][idx]
              }
            }
          }
        ]
      }
      uplotData2.value = data1

      // tzDate normalization is useful for aggregated data, where aggregation
      // ranges and ts need to land on exact 12am without DST shifting goofiness

      uplotData3.value = aggDays(data)
      opts3.value = {
        title: 'Daily Users',
        tzDate: (ts) => uPlot.tzDate(new Date(ts * 1e3), 'Etc/UTC'),
        //	tz: 'Etc/UTC',
        width: 1800,
        height: 200,
        axes: [
          {
            space: 100
          },
          {
            space: 20
          }
        ],
        series: [
          {
            label: '2019',
            stroke: 'rgba(5, 141, 199, 1)',
            fill: 'rgba(5, 141, 199, 0.1)'
          },
          {
            label: '2018',
            stroke: 'rgba(237, 126, 23, 1)'
          },
          {
            label: '2017',
            stroke: 'rgba(255, 0, 0, 1)'
          }
        ]
      }
    })
})
</script>
