<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">Homepage</el-breadcrumb-item>
        <!-- <el-breadcrumb-item>Auth Management</el-breadcrumb-item> -->
        <el-breadcrumb-item>Analytics</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="segment">
        <v-chart class="chart linechart" :option="DAU" />
    </div>
    <div class="segment">
        <v-chart class="chart piechart piechart-left" :option="genre" />
        <v-chart class="chart piechart" :option="media" />
    </div>
    
</template>

<script>
  import { use } from "echarts/core";
  import { ArrowRight } from '@element-plus/icons-vue';
  import { CanvasRenderer } from "echarts/renderers";
  import { PieChart, LineChart } from "echarts/charts";
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
  } from "echarts/components";
  import VChart from "vue-echarts";
  import { ref, provide, computed } from "vue";
  
  use([
    CanvasRenderer,
    PieChart,
    LineChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
  ]);
  
//   const option = ref({
//     width: "500px",
//     title: {
//       text: "Traffic Sources",
//       left: "center"
//     },
//     tooltip: {
//       trigger: "item",
//       formatter: "{a} <br/>{b} : {c} ({d}%)"
//     },
//     legend: {
//       orient: "vertical",
//       left: "left",
//       data: ["Direct", "Email", "Ad Networks", "Video Ads", "Search Engines"]
//     },
//     series: [
//       {
//         name: "Traffic Sources",
//         type: "pie",
//         radius: "55%",
//         center: ["50%", "60%"],
//         data: databyType,
//         emphasis: {
//           itemStyle: {
//             shadowBlur: 10,
//             shadowOffsetX: 0,
//             shadowColor: "rgba(0, 0, 0, 0.5)"
//           }
//         }
//       }
//     ],
//   })

export default {
  name: "Statistic",
  components: {
    VChart
  },
  async created(){
    await this.getDAU();
    await this.getGenre();
    await this.getMedia();
  },
  data() {
    return {
      ArrowRight,
      dataDAU:[],
      genre: {
        title: {
          text: "Reading Data By Genre",
          left:'center'
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        series: [
          {
            name: "Reading Data By Genre",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      media: {
        title: {
          text: "Reading Data By Media",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "Reading Data By Media",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ],
      },
    DAU: computed(() => {
        return {
            title: {
                text: "DAU Data",
                left: "center",
            },
            width: "1000px",
            xAxis: {
            type: "category",
            data: this.dataDAU.map(d => d.date)
            },
            yAxis: {
                type: "value",
                minInterval: 1
            },
            series: [{
                data: this.dataDAU.map(d => d.count),
                type: 'line',
            }]
        }
    })
    };
  },
  methods:{
    async getDAU(){
        const { data } = await this.$http.get("/getDAU");
        this.dataDAU = data.dau;
        },
    async getGenre(){
        const { data } = await this.$http.get("/getGenre");
        const newData = this.objArrtransArr(data.genre, "count", "genre");
        this.genre.series[0].data = newData;
        // console.log("dataGenre", this.dataGenre)
    },
    async getMedia(){
        const { data } = await this.$http.get("/getMedia");
        const newData = this.objArrtransArr(data.media, "count", "media");
        this.media.series[0].data = newData
        // console.log("dataMedia", this.dataMedia)
    },
    objArrtransArr(olddata, oldval, oldname) {
        const newArr = [];
        olddata.forEach(item => {
            let obj = {};
            obj.value = item[oldval];
            obj.name = item[oldname];
            newArr.push(obj);
        });      
        return newArr
    }
  }
};
</script>

<style scoped>
.chart {
    /* width: 100%; */
    height: 300px;
    /* border: 1px solid red; */
    box-sizing:border-box;
}

.piechart {
    padding: 20px;
    margin: 10 0 5 5;
    
}

.piechart-left{
    border-right: 1px solid lightgray;
}

.linechart{
    border-bottom: 1px solid lightgray;
}

.segment{
    display: flex;
}
</style>