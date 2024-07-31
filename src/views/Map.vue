<template>
    <div style="display: flex">
        <div ref="mapShenZhen" style="width: 500px; height: 400px" />
        <div ref="mapShenShan" style="width: 100px; height: 200px" />
    </div>
    <div id="container" />
</template>
<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import * as echarts from 'echarts'
import ShenZhenGeoJSON from '../assets/shenzhen.json'
import ShenShanGeoJSON from '../assets/shenshan.json'
import axios from 'axios'
import AMapLoader from '@amap/amap-jsapi-loader'

// const fs = require("fs");

const mapShenZhen = ref<HTMLDivElement | null>(null);
const mapShenShan = ref<HTMLDivElement | null>(null);

let map = null  //地图
let map2 = null

//标点内容
const markerContent = `<div class="custom-content-marker">
<img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">
</div>`;

//数据
let data = reactive([
    {
        name: '南山区',
        total: 12345,
        growth: 1000,
        development: 111,
        survival: 11,
        known: 1234,
        special: 1234,
        excellent: 1234,
        new: 1234
    },
    {
        name: '深汕特别合作区',
        total: 12345,
        growth: 1000,
        development: 111,
        survival: 11,
        known: 1234,
        special: 1234,
        excellent: 1234,
        new: 1234
    }
])

onMounted(() => {
    if (mapShenZhen.value) {
        const myChart = echarts.init(mapShenZhen.value);
        echarts.registerMap('shenzhen', ShenZhenGeoJSON);
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    const data = params.data;
                    if (data) {
                        return `
                    ${params.name}<br/>
                    个体户总数: ${data.total || 'N/A'}<br/>
                    成长型: ${data.growth || 'N/A'}<br/>
                    发展型: ${data.development || 'N/A'}<br/>
                    生存型: ${data.survival || 'N/A'}<br/>
                    知名个体户: ${data.known || 'N/A'}<br/>
                    特色个体户: ${data.special || 'N/A'}<br/>
                    优质个体户: ${data.excellent || 'N/A'}<br/>
                    新型个体户: ${data.new || 'N/A'}
                `;
                    }
                }
            },
            series: [
                {
                    name: 'Shenzhen Map',
                    type: 'map',
                    map: 'shenzhen',
                    roam: true,
                    itemStyle: {
                        normal: {
                            borderColor: '#389BB7',
                            areaColor: '#fff',
                        },
                        emphasis: {
                            areaColor: '#389BB7',
                            borderWidth: 0,
                        }
                    },
                    data: data
                }
            ]
        };

        myChart.setOption(option);
    }
    if (mapShenShan.value) {
        const myChart = echarts.init(mapShenShan.value);

        echarts.registerMap('shenshan', ShenShanGeoJSON);

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    const data = params.data;
                    if (data) {
                        return `
                    ${params.name}<br/>
                    个体户总数: ${data.total || 'N/A'}<br/>
                    成长型: ${data.growth || 'N/A'}<br/>
                    发展型: ${data.development || 'N/A'}<br/>
                    生存型: ${data.survival || 'N/A'}<br/>
                    知名个体户: ${data.known || 'N/A'}<br/>
                    特色个体户: ${data.special || 'N/A'}<br/>
                    优质个体户: ${data.excellent || 'N/A'}<br/>
                    新型个体户: ${data.new || 'N/A'}
                `;
                    }
                }
            },
            series: [
                {
                    name: 'shenshan Map',
                    type: 'map',
                    map: 'shenshan',
                    roam: true,
                    itemStyle: {
                        normal: {
                            borderColor: '#389BB7',
                            areaColor: '#fff',
                        },
                        emphasis: {
                            areaColor: '#389BB7',
                            borderWidth: 0,
                        }
                    },
                    data: data
                }
            ]
        };

        myChart.setOption(option);
    }
    AMapLoader.load({
        key: 'a514cea7c69d869fa202f1515018a66b',
        version: '1.4.15',
        plugins: [] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
        .then((AMap) => {
            map = new AMap.Map('container', {
                // 设置地图容器id
                viewMode: '3D', // 是否为3D地图模式
                zoom: 11, // 初始化地图级别
                // center: [116.397428, 39.90923] // 初始化地图中心点位置
                center: [114.105173, 22.531628]
            })

            //生成行政区划 polygon
            var polygon = new AMap.Polygon({
                map: map, //显示该覆盖物的地图对象
                strokeWeight: 1, //轮廓线宽度
                path: ShenZhenGeoJSON.features[0].geometry.coordinates, //多边形轮廓线的节点坐标数组
                fillOpacity: 0.7, //多边形填充透明度
                fillColor: "#CCF3FF", //多边形填充颜色
                strokeColor: "#CC66CC", //线条颜色
            });
            map.setFitView();
            //计算经纬度
            function getGridLngLats(points) {
                var lngLats = [];
                points.map((item) => {
                    var center = [item.longitude,item.latitude];
                    var pxCenter = map.lnglatToPixel(center);
                    lngLats.push(map.pixelToLngLat(pxCenter));
                })
                console.log(lngLats)
                return lngLats;
            }
            //标点
            const points = [{ longitude: 114.105173, latitude: 22.531628 }, { longitude: 114.122073, latitude: 22.528233 }];
            const positions = getGridLngLats(points); //Marker 经纬度
            for (let i = 0; i < positions.length; i++) {
                const marker = new AMap.Marker({
                    position: positions[i],
                    content: markerContent, // 将 html 传给 content
                    offset: new AMap.Pixel(-13, -30), // 以 icon 的 [center bottom] 为原点
                });
                map.add(marker);
            }
        })
        .catch((e) => {
            console.log(e)
        })

})
</script>
<style scoped>
#container {
    width: 600px;
    height: 400px;
}
</style>
