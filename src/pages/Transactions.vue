<script setup>
import { useTransactionStore } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";
import TransactionList from "@/components/Transaction/TransactionList.vue";
import TransactionModal from "@/components/Transaction/TransactionModal.vue";
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";

// Store 연결
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

// 날짜 초기값 설정
const now = dayjs();
const dateRange = ref({
  start: now.startOf("month").format("YYYY-MM-DD"),
  end: now.format("YYYY-MM-DD"),
});

// 상태 변수
const modalVisible = ref(false);
const selectedBudget = ref(null);
const selectedCategory = ref("");
const showStartPicker = ref(false);
const showEndPicker = ref(false);

// 계산된 값
const groupedBudgets = computed(() => transactionStore.groupByDate);
const summary = computed(() => transactionStore.summary);
const incomeCategories = computed(() => categoryStore.incomeCategories);
const expenseCategories = computed(() => categoryStore.expenseCategories);
const formattedStart = computed(() =>
  dayjs(dateRange.value.start).format("M월 D일")
);
const formattedEnd = computed(() =>
  dayjs(dateRange.value.end).format("M월 D일")
);

// 초기 데이터 로딩
onMounted(async () => {
  await transactionStore.fetchBudgets();
  await categoryStore.fetchCategories();
  applyFilters();
});

// 메서드 정의
function openAddModal() {
  selectedBudget.value = null;
  modalVisible.value = true;
}

function openEditModal(budget) {
  selectedBudget.value = budget;
  modalVisible.value = true;
}

async function deleteBudget(id) {
  await transactionStore.deleteBudget(id);
  console.log("삭제 요청 ID:", id);
}

function moveMonth(offset) {
  const newStart = dayjs(dateRange.value.start)
    .add(offset, "month")
    .startOf("month");
  const newEnd = newStart.endOf("month");
  dateRange.value.start = newStart.format("YYYY-MM-DD");
  dateRange.value.end = newEnd.format("YYYY-MM-DD");
  applyFilters();
}

function handleStartDateSelect(date) {
  dateRange.value.start = date;
  showStartPicker.value = false;
  applyFilters();
}

function handleEndDateSelect(date) {
  dateRange.value.end = date;
  showEndPicker.value = false;
  applyFilters();
}

function updateCategory() {
  transactionStore.setCategoryFilter(selectedCategory.value);
}

function applyFilters() {
  transactionStore.setDateRange(dateRange.value.start, dateRange.value.end);
  transactionStore.setCategoryFilter(selectedCategory.value);
}

function format(value) {
  return parseInt(value).toLocaleString() + "원";
}
</script>

<template>
  <div class="transaction-page font-hakgyo">
    <div class="filter-bar font-hakgyo">
      <div class="day-filer">
        <button @click="moveMonth(-1)">
          <i class="fa fa-chevron-left" aria-hidden="true"></i>
        </button>
        <span>{{ formattedStart }}</span>
        ~
        <span>{{ formattedEnd }}</span>
        <button @click="moveMonth(1)">
          <i class="fa fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
      <div class="category-filter">
        <select v-model="selectedCategory" @change="updateCategory">
          <option value="">전체 카테고리</option>
          <optgroup label="수입">
            <option
              v-for="income in incomeCategories"
              :key="income.id"
              :value="income.name"
            >
              {{ income.name }}
            </option>
          </optgroup>
          <optgroup label="지출">
            <option
              v-for="expense in expenseCategories"
              :key="expense.id"
              :value="expense.name"
            >
              {{ expense.name }}
            </option>
          </optgroup>
        </select>
      </div>
    </div>
    <div class="summary font-hakgyo">
      <div class="summary-box">
        <p>수입</p>
        {{ format(summary.income) }}
      </div>
      <div class="summary-box">
        <p>지출</p>
        {{ format(summary.expense) }}
      </div>
      <div class="summary-box">
        <p>순이익</p>
        {{ format(summary.net) }}
      </div>
    </div>
    <TransactionList
      :transactions="groupedBudgets"
      @edit="openEditModal"
      @delete="deleteBudget"
    />
    <button
      type="button"
      class="btn rounded-pill px-4 py-2 text-black d-flex align-items-center gap-2 add-btn"
      @click="openAddModal"
    >
      <i class="fa-solid fa-pen-to-square"></i> 거래 추가
    </button>
    <TransactionModal
      v-if="modalVisible"
      :editTarget="selectedBudget"
      @close="modalVisible = false"
    />
  </div>
</template>

<style scoped>
/* 전체 */
.transaction-page {
  padding: 20px;
  font-family: "Pretendard", sans-serif;
  background-color: #fff;
}

/* 날짜 */
.day-filer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  gap: 8px;
  font-size: 30px;
  font-weight: bold;
}
.day-filer button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
.date-range {
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

/* category */
.category-filter {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}
.category-filter select {
  width: 90%;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

/* summary */
.summary {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 16px 0;
}

.summary-box {
  flex: 1;
  background: #e6f3ff;
  border: 2px solid #b4daff;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  color: #333;
}

.summary-box p {
  margin-bottom: 6px;
  font-size: 14px;
}

.summary-box span {
  font-size: 18px;
}

.add-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: #b3e5fc;
}

.add-btn:hover {
  background: #b4d7f7;
}
</style>
