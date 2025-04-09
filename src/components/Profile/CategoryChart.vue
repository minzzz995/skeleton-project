<template>
  <div class="category-analysis">
    <div class="chart-left">
      <DoughnutChart :chartData="chartData" :options="chartOptions" />
    </div>
    <div class="chart-right">
      <p class="top-text">
        최근 3개월간<br />
        '<strong>{{ barChartTopCategory }}</strong
        >' 항목이 가장 많아요
      </p>
      <BarChart @update-top-category="barChartTopCategory = $event" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/store/transactionStore';
import DoughnutChart from './Chart/DoughnutChart.vue';
import BarChart from './Chart/Profile_BarChart.vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { compileScript } from 'vue/compiler-sfc';

ChartJS.register(ArcElement, Tooltip, Legend);

// 스토어
const transactionStore = useTransactionStore();
const monthlyExpenses = ref([]);
const barChartTopCategory = ref('N/A');

// 월별 지출 필터
onMounted(async () => {
  await transactionStore.fetchBudgets(); // ✅ budgets 채우기
  if (transactionStore.budgets && Array.isArray(transactionStore.budgets)) {
    const now = new Date();
    monthlyExpenses.value = transactionStore.budgets.filter((e) => {
      const date = new Date(e.date);
      return (
        e.type === 'expense' &&
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    });
  } else {
    console.warn('transactionStore.budgets is empty or undefined');
  }
});

// 차트 데이터 생성
const chartData = computed(() => {
  const categoryMap = {};

  monthlyExpenses.value.forEach((exp) => {
    categoryMap[exp.category] =
      (categoryMap[exp.category] || 0) + Number(exp.amount);
  });

  const sorted = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 3);
  const etcTotal = sorted.slice(3).reduce((acc, [, amt]) => acc + amt, 0);

  const labels = top.map(([cat]) => cat).concat(etcTotal > 0 ? '기타' : []);
  const data = top.map(([, amt]) => amt).concat(etcTotal > 0 ? etcTotal : []);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          '#AEEEEE', // 밝은 파랑
          '#87CEFA', // 하늘 파랑
          '#ADD8E6', // 연한 파랑
          '#D3D3D3', // 기타
        ],
      },
    ],
  };
});

// 가장 많이 사용된 카테고리 추출
const topCategory = computed(() => {
  const sorted = Object.entries(
    monthlyExpenses.value.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return sorted.length > 0 ? sorted[0][0] : 'N/A';
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};
</script>

<style scoped>
.category-analysis {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #f2faff;
  padding: 20px;
  border-radius: 16px;
  flex-wrap: wrap; /* 중요: 줄바꿈 허용 */
}

.chart-left,
.chart-right {
  width: 48%;
  flex: 1;
}
.chart-left {
  flex: 1;
  width: 48%;
  aspect-ratio: 1 / 1; /* 정사각형 비율 유지 */
  min-width: 200px;
}
.chart-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top-text {
  background-color: #d6f3fe;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 1rem;
  color: #0077c2;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
}

/* ✅ 반응형 처리 */
@media (max-width: 768px) {
  .category-analysis {
    flex-direction: column;
    align-items: stretch;
  }

  .chart-left,
  .chart-right {
    width: 100%;
  }

  .top-text {
    text-align: center;
  }
}
</style>
