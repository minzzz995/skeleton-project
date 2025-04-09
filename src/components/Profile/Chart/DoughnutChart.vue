<!-- src/components/common/charts/DoughnutChart.vue -->
<template>
  <Chart type="doughnut" :data="chartData" :options="options" />
</template>

<script setup>
import { defineProps } from 'vue';
import { Chart } from 'vue-chartjs';
import {
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Chart as ChartJS,
} from 'chart.js';

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

defineProps({
  chartData: Object,
  options: Object,
});
</script>
