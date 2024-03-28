<template>
  <div class="flex flex-col">
    <header>
      <HelloWorld msg="You did it!" />
    </header>
    <div class="flex mt-20">
      <div class="w-260">
        <a-menu
          v-model:openKeys="openKeys"
          v-model:selectedKeys="selectedKeys"
          mode="inline"
          :items="items"
          class="w-260"
          @click="handleClick"
        />
      </div>
      <div class="ml-50">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Menu as AMenu } from 'ant-design-vue'
import { h, ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ItemType } from 'ant-design-vue'
import { HighlightOutlined, PieChartOutlined } from '@ant-design/icons-vue'
import { Key } from 'ant-design-vue/es/_util/type'

const router = useRouter()
const route = useRoute()

const items: ItemType[] = [
  {
    label: '数据可视化',
    key: 'visualization',
    icon: h('i', { class: 'iconfont icon-barchart' }),
    children: [
      { label: 'Echarts', key: 'echarts', icon: h(PieChartOutlined) },
      { label: 'AntvG2', key: 'antvG2', icon: h(PieChartOutlined) },
      { label: 'UPlot', key: 'uPlot', icon: h(PieChartOutlined) },
      { label: 'UPlotZoom', key: 'uPlotZoom', icon: h(PieChartOutlined) },
      { label: 'Zoom', key: 'Zoom', icon: h(PieChartOutlined) }
    ]
  },
  { label: '二维码', key: 'qrCode', icon: h('i', { class: 'iconfont icon-bulletin' }) },
  { label: 'markdown文档', key: 'markdown', icon: h(HighlightOutlined) }
]

const openKeys = ref(['visualization'])
let selectedKeys = ref<Array<Key>>([])

onMounted(() => {
  selectedKeys.value = [route.name as Key]
})

const handleClick = (data) => {
  selectedKeys.value = [data.key]
  router.push(data.key)
  console.log(route.name)
}
</script>
<style scoped>
@import url('//at.alicdn.com/t/c/font_4444061_um8j0i83ahk.css');
</style>
