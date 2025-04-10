<template>
  <div class="font-dahaeng">
    <apexchart type="bar" height="200" :series="series" />
    <div class="top-category-card">
      <div class="icon">
        <i :class="iconClass" class="category-icon" aria-hidden="true"></i>
      </div>
      <div class="text">
        <h3>{{ categoryName }}</h3>
        <p>지난 달보다</p>
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useTransactionStore } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";
import dayjs from "dayjs";

const props = defineProps({
  type: String, // 'saved' or 'overspent'
});

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const loading = ref(true);
const categoryData = ref(null);

const now = dayjs();
const startOfThisMonth = now.startOf("month");
const startOfLastMonth = now.subtract(1, "month").startOf("month");
const endOfLastMonth = startOfThisMonth.subtract(1, "day");

function getCategorySumByMonth(start, end) {
  const result = {};
  transactionStore.budgets.forEach((t) => {
    const date = dayjs(t.date);
    if (
      t.type === "expense" &&
      date.isAfter(start.clone().subtract(1, "day")) &&
      date.isBefore(end.clone().add(1, "day"))
    ) {
      result[t.category] = (result[t.category] || 0) + Number(t.amount);
    }
  });
  return result;
}

function calculateComparison() {
  const thisMonthData = getCategorySumByMonth(startOfThisMonth, now);
  const lastMonthData = getCategorySumByMonth(startOfLastMonth, endOfLastMonth);

  const categories = new Set([
    ...Object.keys(thisMonthData),
    ...Object.keys(lastMonthData),
  ]);

  const diffs = Array.from(categories).map((category) => {
    const thisMonth = thisMonthData[category] || 0;
    const lastMonth = lastMonthData[category] || 0;
    return { category, diff: thisMonth - lastMonth };
  });

  if (props.type === "saved") {
    categoryData.value =
      diffs.filter((d) => d.diff < 0).sort((a, b) => a.diff - b.diff)[0] ||
      null;
  } else {
    categoryData.value =
      diffs.filter((d) => d.diff > 0).sort((a, b) => b.diff - a.diff)[0] ||
      null;
  }

  loading.value = false;
}

onMounted(async () => {
  if (!transactionStore.budgets.length) {
    await transactionStore.fetchBudgets();
  }
  if (!categoryStore.expenseCategories.length) {
    await categoryStore.fetchCategories();
  }
  calculateComparison();
});

watch(
  () => transactionStore.budgets,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      calculateComparison();
    }
  },
  { immediate: true }
);

const categoryName = computed(() =>
  loading.value ? "로딩 중..." : categoryData.value?.category || "알 수 없음"
);

const description = computed(() => {
  if (loading.value) return "잠시만 기다려주세요...";

  const diff = Math.abs(categoryData.value?.diff || 0);
  const verb = props.type === "saved" ? "절약했어요!" : "더 많이 썼어요!";
  return `${diff.toLocaleString()}원 ${verb}`;
});

const iconClass = computed(() => {
  const match = categoryStore.expenseCategories.find(
    (c) => c.name === categoryName.value
  );
  return match?.imgpath || "fa-solid fa-circle-question";
});
</script>

<style scoped>
.top-category-card {
  width: 100%;
  max-width: 100%;
  background-color: #e0f7fa;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-content: space-between;
}

.icon {
  flex: 1;
  width: 50%;
}

.text {
  flex: 2;
  width: 50%;
}

.icon-and-title {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.category-icon {
  font-size: clamp(2rem, 5vw, 4rem);
  color: #0077c2;
}

.top-category-card h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #0077c2;
}

.top-category-card p {
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
  color: #333;
}
</style>
