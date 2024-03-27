<template>
  <div class="about">
    <a-table :dataSource="dataSource" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { Table as ATable } from 'ant-design-vue'
import { onMounted } from 'vue'
import request from '@/utils/request'

onMounted(() => {
  request.get('/mock/getData')
})

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  }
]

const dataSource = [
  {
    name: 'Coral'
  }
]
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
