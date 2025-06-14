<script setup>
import { onMounted, ref } from 'vue';
import TheWelcome from '../components/TheWelcome.vue';
import * as echarts from 'echarts';
import china from '../assets/china.json';
import waterJson from '../assets/waterJson.json';
import waterData from '../assets/waterData.json';

const INITIAL = -1
let count = INITIAL;

function getDataList(idx) {
  
  const dataList = Array(76).fill(1).map((item, index) => {
    const data = waterData[index];
    const name =data[0];
    
    const value =data[2 + 10 * idx];
    // console.log('value of ~ ', idx, index, name, value);
    return {
      name: `${index}_${name}`,
      value,
      // value: waterData[index] ? waterData[index].value : Math.round(Math.random() * 1000000)
    };
  });
  const maxValue = Math.max(...dataList.map(it => it.value));
  const minValue = Math.min(...dataList.map(it => it.value));
  console.log('getDataList of ~ ', idx, dataList, maxValue, minValue);
  return {
    maxValue,
    minValue,
    dataList,
  };
}

const {dataList} = getDataList(0)
const total =  dataList.length;

let instance = ref(null);
let instance2 = ref(null);

let scale = ref(1);


function init() {
  // 比例尺
  const width = 40;
  const height = 10;
  const left = 0;
  const top = 400;
  
  var MyShape = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    buildPath: function(ctx, shape) {
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(shape.x + shape.width, shape.y);
      ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
      ctx.lineTo(shape.x, shape.y + shape.height);
      ctx.closePath();
    }
  });
  echarts.graphic.registerShape('myCustomShape', MyShape);
  
  const geoJson = {
    "type": "FeatureCollection",
    "features": waterJson.geometries.slice(0, 69).map((item, index) => ({
      "type": "Feature",
      "properties":
          {
            "name": `${index}_${waterData[index][0]}`,
          },
      geometry: item
    })),
  };
  console.log('geoJson ~ ', geoJson, dataList);
  echarts.registerMap('water', {
    geoJSON: geoJson
  });
  
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
    // visualMap: {
    //   type: 'piecewise',
    //   pieces: [
    //     {gt: 1024 * 1024 * 1024, label: '>1GB'}, // 不指定 max，表示 max 为无限大（Infinity）。
    //     {gt: 1024 * 1024, lte: 1024 * 1024 * 1024, label: '(1MB,1GB]'},
    //     {gt: 500 * 1024, lte: 1024 * 1024, label: '(500KB,1MB]'},
    //     {gt: 1024, lte: 500 * 1024, label: '(1KB,500KB]'},
    //     {gt: 0, lte: 1024, label: '(0,1KB]'} // 不指定 min，表示 min 为无限大（-Infinity）。
    //   ],
    //   show: true,
    //   x: 'left',
    //   y: 'center',
    //   color: ['#5a7097', '#7be7db', '#b4f0d2', '#e0fafb']
    // },
    visualMap: {
      min: -2000000,
      max: 8000000,
      left: 'right',
      top: 'center',
      calculable: true,
      realtime: false,
      splitNumber: 8,
      inRange: {
        color: [
          '#F2CCD4',
          '#FFFDFE',
          '#FFFFFF',
          '#D7DFEF',
          '#B2C3E0',
          '#8FA7D2',
          '#637CA9'
        ]
      }
    },
    xAxis: {
      type: 'category',
      data: [0, 110]
    },
    yAxis: {
      type: 'category',
      data: [0, 150]
    },
    graphic: [
    // 比例尺文字
      {
        type: 'text', // 类型
        left: left - 5, // 位置
        top: top + height + 5,
        style: {
          text: '0',
          font: '16px Microsoft YaHei',
          fill: '#333' // 颜色
        }
      },
      {
        type: 'text', // 类型
        left: left + width - 10, // 位置
        top: top + height + 5,
        style: {
          text: '25',
          font: '16px Microsoft YaHei',
          fill: '#333' // 颜色
        }
      },
      {
        type: 'text', // 类型
        left: left + width * 2 - 10, // 位置
        top: top + height + 5,
        style: {
          text: '50',
          font: '16px Microsoft YaHei',
          fill: '#333' // 颜色
        }
      },
      {
        type: 'text', // 类型
        left: left + width * 2 + 10, // 位置
        top: top,
        style: {
          text: 'Km',
          font: '16px Microsoft YaHei',
          fill: '#333' // 颜色
        }
      },
    ],
    // 配置属性
    series: [
      {
        name: '数据',
        type: 'map',
        mapType: 'water',
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
      },
      {
        name: '热力图',
        type: "heatmap",
        // coordinateSystem: "geo",
        geoIndex: 0,
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1
          }
        },
        data: [
          // [0, 0, 0.44],
          // [0, 1, 0.55],
          // [0, 2, 0.8],
        ],
      },
      // 比例尺图标
      {
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function(params, api) {
          return {
            type: 'myCustomShape',
            shape: {
              x: api.value(0),
              y: api.value(1),
              width: api.value(2),
              height: api.value(3)
            },
            style: {
              fill: '#000000',
              strokeWidth: 2,
              stroke: 'red'
            }
          };
        },
        data: [
          [left, top, width, height]
        ]
      },
      {
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function(params, api) {
          return {
            type: 'myCustomShape',
            shape: {
              x: api.value(0),
              y: api.value(1),
              width: api.value(2),
              height: api.value(3)
            },
            style: {
              fill: '#f2f2f2',
              stroke: 'red'
            }
          };
        },
        data: [
          [left + width, top, width, height]
        ]
      },
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
    const {minValue, maxValue, dataList} = getDataList(count)
    instance.value.setOption({
      visualMap: {
        max: maxValue * 1.2,
        min: minValue * 1.4,
      },
      series: [{
        data: dataList
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
  count = INITIAL;
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

  // 动态调整图例大小（例如根据窗口大小）
  window.addEventListener('resize', function() {
    const clientWidth = document.documentElement.clientWidth;
    scale.value = clientWidth/2543;
    
    console.log('clientWidth', clientWidth, scale.value);
  });
  
});

</script>

<template>
  <main>
    <button @click="start">Start</button>
    <div :style="{'width':'800px','height':'600px','transform': 'scale(' + scale + ')', 'transform-origin': '0 0'}" id="chartsDOM"></div>
    <div :style="{'width':'800px','height':'600px','transform': 'scale(' + scale + ')', 'transform-origin': '0 0'}" id="chartsDOM2"></div>
  </main>
</template>
