<template>
  <div class="dashboard-container d-flex flex-column">
    <b-row>
      <b-col cols="12">
        <div class="" style="padding-top: 0;">
          <h3 style="color: #1a3035" class="font-weight-bold my-4">
            <label style="margin-left: 1rem; font-size: 3rem;">{{ $t('dashboard.title') }}</label>
          </h3>
        </div>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <label></label>
      </b-col>
    </b-row>

    <b-row class="mt-2">
      <b-col cols="12" class="d-flex align-content-start justify-content-start">
        <p>Todo List:<br>
          1.This is Admin System for managing all of the Project.
        </p>
      </b-col>
    </b-row>
    <b-row class="px-4 py-4">
      <b-col cols="12">
        <p style="font-size: 1.1875rem;" class="mb-0">{{ $t('dashboard.student-graph') }}</p>
      </b-col>
      <b-col cols="12">
        <v-chart :options="lineChart1Options" style="width: 100%; height: 300px" :autoresize="true"/>
      </b-col>
    </b-row>

    <b-row class="px-4 py-4">
      <b-col cols="12">
        <p style="font-size: 1.1875rem;" class="mb-0">{{ $t('dashboard.hours-graph') }}</p>
      </b-col>
      <b-col cols="12">
        <v-chart :options="lineChart2Options" style="width: 100%; height: 300px" :autoresize="true"/>
      </b-col>
    </b-row>

  </div>
</template>
<script>
//import {getLocale} from '../../utils';
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

export default {
  components: {
    'v-chart': ECharts,

  },

  mounted() {

  },

  data() {
    return {
      lineChart1Options: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            interval:'0',
            rotate: 0
          },
          data: ['org1','org2','org3','org4','org5','org6','org7','org8', 'org9']
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true
          }
        },
        series: [
          {
            name: 'minute',
            type: 'line',
            stack: this.$t('statistics.view.total'),
            symbolSize: 12,
            data: [0,18,23,33,15,26,17,8,19]
          },
        ],
        color: ['#ff0000']
      },

      lineChart2Options: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            interval:'0',
            rotate: 0
          },
          data: ['org1','org2','org3','org4','org5','org6','org7','org8', 'org9']
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true
          }
        },
        series: [
          {
            name: 'minute',
            type: 'line',
            stack: this.$t('statistics.view.total'),
            symbolSize: 12,
            data: [10,31,22,23,75,66,77,58,90,70]
          },
        ],
        color: ['#ff0000']
      },

    }
  }
}
</script>
<style>
.bg-dashboard {
  height: fit-content;
  height: 400px;
  box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075) !important;
  border-radius: 10px;

  & > div {
    background: transparent !important;
  }

}

.bg-image {
  height: fit-content;
  height: 400px;
  box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075) !important;
  border-radius: 15px;

  & > div {
    background: transparent !important;
  }

}

.image-label-2 {
  margin-left: 21rem;
  margin-top: 8rem;
  font-size: 15px;
  float: left;
  padding-left: 6rem;
  width: 22rem
}
.image-label-1 {
  margin-left: 21rem;
  font-size: 15px;
  float: left;
  padding-left: 6rem;
  width: 22rem
}
</style>

