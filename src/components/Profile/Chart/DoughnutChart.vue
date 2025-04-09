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

// 기존 options에서 legend를 끄는 설정을 병합
const optionsWithLegendHidden = computed(() => {
  return {
    ...props.options,
    plugins: {
      ...(props.options?.plugins || {}),
      legend: {
        display: false,
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
  font-family: 'NanumDahaeng', sans-serif;
  font-size: 2rem;
  color: #444;
}
</style>
