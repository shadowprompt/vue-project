<script setup>
import { onMounted, ref } from 'vue';
import TheWelcome from '../components/TheWelcome.vue';
import * as echarts from 'echarts';
import china from '../assets/china.json';

let count = 0;

const dataList = [
  // {name: '北京市',value: Math.round(Math.random()*1000000)},
  // {name: '天津市',value: Math.round(Math.random()*2000000)},
  {name: '上海市',value: Math.round(Math.random()*1000000)},
  {name: '重庆市',value: Math.round(Math.random()*3000000)},
  {name: '河北省',value: Math.round(Math.random()*4000000)},
  {name: '河南省',value: Math.round(Math.random()*6000000)},
  {name: '云南省',value: Math.round(Math.random()*7000000)},
  {name: '辽宁省',value: Math.round(Math.random()*9000000)},
  {name: '黑龙江省',value: Math.round(Math.random()*1000000)},
  {name: '湖南省',value: Math.round(Math.random()*1000)},
  {name: '安徽省',value: Math.round(Math.random()*1000)},
  {name: '山东省',value: Math.round(Math.random()*1000)},
  {name: '新疆',value: Math.round(Math.random()*1000)},
  {name: '江苏省',value: Math.round(Math.random()*1000)},
  {name: '浙江省',value: Math.round(Math.random()*1000)},
  {name: '江西省',value: Math.round(Math.random()*1000)},
  {name: '湖北省',value: Math.round(Math.random()*1000)},
  {name: '广西',value: Math.round(Math.random()*1000)},
  {name: '甘肃省',value: Math.round(Math.random()*1000)},
  {name: '山西省',value: Math.round(Math.random()*1000)},
  {name: '内蒙古',value: Math.round(Math.random()*1000)},
  {name: '陕西省',value: Math.round(Math.random()*1000)},
  {name: '吉林省',value: Math.round(Math.random()*1000)},
  {name: '福建省',value: Math.round(Math.random()*1000)},
  {name: '贵州省',value: Math.round(Math.random()*1000)},
  {name: '广东省',value: Math.round(Math.random()*1000)},
  {name: '青海省',value: Math.round(Math.random()*1000)},
  {name: '西藏',value: Math.round(Math.random()*1000)},
  {name: '四川省',value: Math.round(Math.random()*1000)},
  {name: '宁夏',value: Math.round(Math.random()*1000)},
  {name: '海南省',value: Math.round(Math.random()*1000)},
  {name: '台湾省',value: Math.round(Math.random()*1000)},
  {name: '香港',value: Math.round(Math.random()*1000)},
  {name: '澳门',value: Math.round(Math.random()*1000)}
].slice(0, 7);
const total =  dataList.length;

let instance = ref(null);
let instance2 = ref(null);


function init() {
  echarts.registerMap('china', china);
  
  instance.value = echarts.init(document.getElementById('chartsDOM'))
  instance2.value = echarts.init(document.getElementById('chartsDOM2'))
  
  const options = {
    tooltip: {
      trigger: 'item',
      valueFormatter: (...rest) => {
        // console.log('rest ~ ', rest);
        return rest;
      }
    },
    toolbox: {
      top: 0,
      feature: {
        saveAsImage: {
          title: '保存图片'
        },
        dataZoom: {
          title: {
            zoom: '区域缩放',
            back: '区域缩放还原'
          }
        }
      }
    },
    // 左侧小导航图标
    visualMap: {
      type: 'piecewise',
      pieces: [
        {gt: 1024 * 1024 * 1024, label: '>1GB'}, // 不指定 max，表示 max 为无限大（Infinity）。
        {gt: 1024 * 1024, lte: 1024 * 1024 * 1024, label: '(1MB,1GB]'},
        {gt: 500 * 1024, lte: 1024 * 1024, label: '(500KB,1MB]'},
        {gt: 1024, lte: 500 * 1024, label: '(1KB,500KB]'},
        {gt: 0, lte: 1024, label: '(0,1KB]'} // 不指定 min，表示 min 为无限大（-Infinity）。
      ],
      show: true,
      x: 'left',
      y: 'center',
      color: ['#5a7097', '#7be7db', '#b4f0d2', '#e0fafb']
    },
    // 配置属性
    series: [
      {
        name: '数据',
        type: 'map',
        mapType: 'china',
        roam: true,
        zoom: 1.2,
        label: {
          normal: {
            show: true // 省份名称
          },
          emphasis: {
            show: false
          }
        },
        data: [],
      }
    ]
  }
  instance.value.setOption(options);

  const option2 = {
    title: {
      text: 'Stacked Line'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Email', 'Union Ads']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [0, 0, 0, 0, 0, 0, 0]
      },
    ]
  };

  instance2.value.setOption(option2);
}


function run() {
  let setId = setInterval(() => {
    count = count + 1;
    console.log('set ~ ', `${count}/${total}`, setId);
    instance.value.setOption({
      series: [{
        data: dataList.slice(0, count)
      }]
    });

    instance2.value.setOption({
      series: [{
        data: dataList.slice(0, count).map(item => item.value)
      }]
    });

    if (count >= total) {
      console.log('clear ~ ', setId);
      clearInterval(setId);
    }
  }, 1500);
}

function start() {
  count = 0;
  console.log('reset ~ ', `${count}/${total}`);
  instance.value.setOption({
    series: [{
      data: []
    }]
  });

  instance2.value.setOption({
    series: [{
      data: [],
    }]
  });
  
  run();
}

onMounted(() => {
  console.log(`the component is now mounted.`);
  window.vm = this;
  
  init();
  
});

</script>

<template>
  <main>
    <button @click="start">Start</button>
    <div style="width:800px;height:600px" id="chartsDOM"></div>
    <div style="width:800px;height:600px" id="chartsDOM2"></div>
  </main>
</template>
