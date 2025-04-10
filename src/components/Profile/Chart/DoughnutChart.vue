<!-- src/components/common/charts/DoughnutChart.vue -->
<template>
  <div class="doughnut-chart-wrapper">
    <div class="chart-label">최근 1개월 소비 패턴</div>
    <Chart
      type="doughnut"
      :data="chartData"
      :options="optionsWithLegendHidden"
    />
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { Chart } from 'vue-chartjs';
import {
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  Chart as ChartJS,
} from 'chart.js';

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

const props = defineProps({
  chartData: Object,
  options: Object,
});

const optionsWithLegendHidden = computed(() => {
  return {
    ...props.options,
    plugins: {
      ...(props.options?.plugins || {}),
      legend: {
        display: true,
        ...(props.options?.plugins?.legend || {}),
      },
    },
  };
});
</script>

<style scoped>
.doughnut-chart-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.chart-label {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 2rem;
  color: #444;
}
</style>
