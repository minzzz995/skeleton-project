<template>
  <div class="bar-chart-container">
    <p class="top-text">
      최근 3개월간<br />
      '<strong>{{ topCategory }}</strong
      >' 항목이 가장 많아요
    </p>
    <Bar :data="barChartData" :options="chartOptions" />
    <div class="labels">
      <div
        v-for="(item, index) in topCategories"
        :key="index"
        class="label-item"
      >
        <p class="category">{{ item.category }}</p>
        <p class="percentage">{{ item.percentage.toFixed(1) }}%</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { useTransactionStore } from '@/store/transactionStore';
import { ref, computed, onMounted } from 'vue';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const transactionStore = useTransactionStore();
const threeMonthExpenses = ref([]);

onMounted(async () => {
  await transactionStore.fetchBudgets();

  const now = new Date();
  threeMonthExpenses.value = transactionStore.budgets.filter((e) => {
    const date = new Date(e.date);
    const isSameYear = date.getFullYear() === now.getFullYear();
    const isInLast3Months =
      now.getMonth() - date.getMonth() <= 2 &&
      now.getMonth() - date.getMonth() >= 0;

    return e.type === 'expense' && isSameYear && isInLast3Months;
  });
});

const topCategories = computed(() => {
  const categoryMap = {};

  threeMonthExpenses.value.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
  });

  const sorted = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const total = sorted.reduce((sum, [, amt]) => sum + amt, 0);

  return sorted.map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / total) * 100,
  }));
});

const barChartData = computed(() => ({
  labels: topCategories.value.map((item) => item.category),
  datasets: [
    {
      label: '',
      data: topCategories.value.map((item) => item.amount),
      backgroundColor: ['#AEEEEE', '#87CEFA', '#ADD8E6'],
      borderRadius: 12,
      barThickness: 40,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
    },
  },
};

const topCategory = computed(() =>
  topCategories.value.length > 0 ? topCategories.value[0].category : 'N/A'
);
</script>

<style scoped>
.bar-chart-container {
  background-color: white;
  padding: 20px;
  border-radius: 16px;
}

.top-text {
  text-align: center;
  margin-bottom: 12px;
  color: #0077c2;
  font-weight: 500;
  font-size: 1rem;
}

.labels {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
}

.label-item {
  text-align: center;
}

.category {
  font-weight: 600;
}

.percentage {
  font-size: 0.9rem;
  color: #555;
}
</style>
