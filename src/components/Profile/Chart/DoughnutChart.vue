<template>
  <div class="doughnut-chart-wrapper">
    <div class="chart-label">최근 1개월 소비 패턴</div>
    <div class="chart-layout">
      <!-- 차트 -->
      <div class="chart-container">
        <Chart
          type="doughnut"
          :data="chartData"
          :options="optionsWithLegendHidden"
        />
        <div
          v-if="hoverData.label"
          class="center-label"
          :style="{ color: rankColor }"
        >
          <div style="color: black">{{ hoverData.label }}</div>
          <div class="center-value">{{ hoverData.value }}</div>
          <div>{{ hoverData.percentage }}</div>
        </div>
      </div>

      <!-- 범례 -->
      <ul class="custom-legend">
        <li
          v-for="(label, index) in chartData.labels"
          :key="index"
          class="legend-item"
        >
          <span
            class="color-box"
            :style="{
              backgroundColor: chartData.datasets[0].backgroundColor[index],
            }"
          ></span>
          <span class="legend-text">{{ label }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue';
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'vue-chartjs';

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

const props = defineProps({
  chartData: Object,
  options: Object,
});

const hoverData = ref({
  label: '',
  value: '',
  percentage: '',
  rank: null,
});

const externalTooltipHandler = (context) => {
  const tooltipModel = context.tooltip;
  const dataIndex = tooltipModel.dataPoints?.[0]?.dataIndex;
  if (dataIndex == null) return;

  const label = props.chartData.labels?.[dataIndex] || '';
  const value = props.chartData.datasets[0]?.data?.[dataIndex] || 0;
  const allData = props.chartData.datasets[0]?.data || [];
  const allLabels = props.chartData.labels || [];

  const filtered = allData
    .map((val, idx) => ({ val, idx, label: allLabels[idx] }))
    .filter((item) => item.label !== '기타')
    .sort((a, b) => b.val - a.val);

  const rank = filtered.findIndex((item) => item.idx === dataIndex) + 1;
  const total = allData.reduce((a, b) => a + b, 0) || 1;
  const percent = ((value / total) * 100).toFixed(0);

  hoverData.value = {
    label,
    value: `${Number(value).toLocaleString()}원`,
    percentage: `${percent}%`,
    rank: label === '기타' ? null : rank,
  };
};

const rankColor = computed(() => {
  switch (hoverData.value.rank) {
    case 1:
      return '#039BE5';
    case 2:
      return '#29B6F6';
    case 3:
      return '#4fc3f7';
    default:
      return '#666';
  }
});

const optionsWithLegendHidden = computed(() => ({
  ...props.options,
  plugins: {
    ...(props.options?.plugins || {}),
    legend: { display: false },
    tooltip: {
      enabled: false,
      external: externalTooltipHandler,
    },
  },
}));
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

.chart-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.chart-container {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
  display: grid;
  place-items: center;
}

.chart-container canvas {
  display: block;
  margin: 0 auto;
}

.center-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.4;
  pointer-events: none;
}

.center-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.25rem 0;
}

.custom-legend {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
}

.color-box {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  margin-right: 8px;
  flex-shrink: 0;
}

.legend-text {
  font-size: 0.9rem;
  color: #444;
}
</style>
