<template>
  <div class="category-analysis">
    <div class="chart-left">
      <DoughnutChart :chartData="chartData" :options="chartOptions" />
    </div>
    <div class="chart-right">
      <p class="top-text">
        최근 3개월간<br />
        '<strong>{{ topCategory }}</strong
        >' 항목이 가장 많아요
      </p>
      <!-- <BarChart :chartData="barChartData" :options="barChartOptions" /> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/store/transactionStore';
import DoughnutChart from './Chart/DoughnutChart.vue';
import BarChart from './Chart/Profile_BarChart.vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// 스토어
const transactionStore = useTransactionStore();
const monthlyExpenses = ref([]);

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

//상위 카테고리 검출
const topCategory = computed(() => {
  const map = {};
  monthlyExpenses.value.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + Number(e.amount);
  });

  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : 'N/A';
});

// 차트 데이터 생성
const chartData = computed(() => {
  const categoryMap = {};

  monthlyExpenses.value.forEach((exp) => {
    categoryMap[exp.category] =
      (categoryMap[exp.category] || 0) + Number(exp.amount);
  });

  const sorted = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const labels = sorted.map(([category]) => category);
  const data = sorted.map(([, amount]) => amount);

  const colors = [
    '#AEEEEE',
    '#87CEFA',
    '#ADD8E6',
    '#B0E0E6',
    '#AFEEEE',
    '#E0FFFF',
    '#B0C4DE',
    '#D8BFD8',
    '#DDA0DD',
    '#EE82EE',
    '#DA70D6',
    '#FFB6C1',
    '#FFC0CB',
    '#F08080',
    '#FA8072',
    '#E9967A',
    '#FFD700',
    '#FFE4B5',
    '#F0E68C',
    '#E6E6FA',
    '#98FB98',
    '#90EE90',
    '#00FA9A',
    '#00CED1',
    '#48D1CC',
    '#40E0D0',
    '#7FFFD4',
    '#66CDAA',
    '#20B2AA',
    '#5F9EA0',
  ];

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, labels.length),
      },
    ],
  };
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
  width: 40%;
  flex: 1;
}
.chart-left {
  flex: 1;
  aspect-ratio: 1 / 1;
  min-width: 200px;
  margin-right: 1rem; /* 기본: 넓을 때 우측 마진 */
}

.chart-right {
  margin-left: 1rem; /* 기본: 넓을 때 좌측 마진 */
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ✅ 반응형 처리 */
@media (max-width: 768px) {
  .category-analysis {
    flex-direction: column;
    align-items: stretch;
  }

  .chart-left {
    margin-right: 0; /* 좌우 마진 제거 */
    margin-bottom: 1rem; /* 아래쪽 마진 추가 */
  }

  .chart-right {
    margin-left: 0; /* 좌우 마진 제거 */
    margin-top: 1rem; /* 위쪽 마진 추가 */
  }
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
