<template>
  <div class="bar-chart">
    <div v-for="(item, index) in topCategories" :key="index" class="bar-item">
      <div class="bar-label">{{ item.name }}</div>
      <div class="bar-visual-container">
        <div class="bar-visual" :style="{ width: item.percentage + '%' }"></div>
        <div class="bar-percentage">{{ item.percentage }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTransactionStore } from '@/store/transactionStore';

const store = useTransactionStore();

// 상위 3개 항목 가져오기
const topCategories = computed(() => {
  const categories = store.categorySummary
    .slice()
    .sort((a, b) => b.amount - a.amount);
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return categories.slice(0, 3).map((cat) => ({
    name: cat.name,
    percentage: Math.round((cat.amount / total) * 100),
  }));
});
</script>

<style scoped>
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.bar-item {
  display: flex;
  flex-direction: column;
}

.bar-label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #333;
}

.bar-visual-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bar-visual {
  height: 10px;
  border-radius: 4px;
  background-color: #87cefa; /* 연파랑 */
  transition: width 0.3s ease;
  flex: 1;
}

.bar-percentage {
  width: 3rem;
  text-align: right;
  font-weight: 500;
  color: #555;
}
</style>
