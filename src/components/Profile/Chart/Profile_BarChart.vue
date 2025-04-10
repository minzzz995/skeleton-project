<template>
  <div class="bar-chart-container">
    <Bar :data="barChartData" :options="chartOptions" />
    <div class="labels">
      <div
        v-for="(item, index) in topCategories"
        :key="index"
        class="label-item"
      >
        <p class="category">{{ item.category }}</p>
        <p class="percentage">{{ item.percentage.toFixed(0) }}%</p>
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
import { ref, computed, onMounted, watch } from 'vue';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const emit = defineEmits(['update-top-category']);
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
    .slice(0, 3); // ❗ 기타 없음

  const total = sorted.reduce((sum, [, amt]) => sum + amt, 0);

  return sorted.map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / total) * 100,
  }));
});

const topCategory = computed(() => topCategories.value[0]?.category || 'N/A');

watch(
  topCategory,
  (newVal) => {
    emit('update-top-category', newVal);
  },
  { immediate: true }
);

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
      ticks: {
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
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* topCategories 수만큼 */
  margin-top: 16px;
  gap: 0; /* 막대와 정확히 붙이려면 gap 없애기 */
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
