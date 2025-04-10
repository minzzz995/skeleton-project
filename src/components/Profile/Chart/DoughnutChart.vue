<template>
  <div class="doughnut-chart-wrapper">
    <div class="chart-label">최근 1개월 소비 패턴</div>
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
        <div>{{ hoverData.label }}</div>
        <div class="center-value">{{ hoverData.value }}</div>
        <div>{{ hoverData.percentage }}</div>
      </div>
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

// 툴팁에 따라 중앙에 보여줄 데이터
const hoverData = ref({
  label: '',
  value: '',
  percentage: '',
  rank: null,
});

// 툴팁 사용자 정의 핸들러
const externalTooltipHandler = (context) => {
  const tooltipModel = context.tooltip;
  const dataIndex = tooltipModel.dataPoints?.[0]?.dataIndex;
  if (dataIndex == null) return;

  const label = props.chartData.labels?.[dataIndex] || '';
  const value = props.chartData.datasets[0]?.data?.[dataIndex] || 0;

  const allData = props.chartData.datasets[0]?.data || [];
  const allLabels = props.chartData.labels || [];

  // "기타"를 제외한 순위 계산
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
    rank: label === '기타' ? null : rank, // 기타는 rank를 없애서 색 안바뀌게
  };
};

// 텍스트 색상: 순위에 따라 달라짐
const rankColor = computed(() => {
  switch (hoverData.value.rank) {
    case 1:
      return '#039BE5'; // 연한 파랑
    case 2:
      return '#29B6F6'; // 하늘색
    case 3:
      return '#4fc3f7'; // 아쿠아 블루
    default:
      return '#666'; // 기본 회색
  }
});

// 옵션: 기존 옵션 병합 + legend 끄고 tooltip 외부로 설정
const optionsWithLegendHidden = computed(() => {
  return {
    ...props.options,
    plugins: {
      ...(props.options?.plugins || {}),
      legend: { display: false },
      tooltip: {
        enabled: false,
        external: externalTooltipHandler,
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

.chart-container {
  position: relative;
  width: 300px;
  height: 300px;
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
</style>
