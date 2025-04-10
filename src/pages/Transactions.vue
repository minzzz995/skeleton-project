<script setup>
import { useTransactionStore } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";
import TransactionList from "@/components/Transaction/TransactionList.vue";
import TransactionModal from "@/components/Transaction/TransactionModal.vue";
import TransactionEditModal from "@/components/Transaction/TransactionEditModal.vue";
import { ref, computed, onMounted } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import * as bootstrap from "bootstrap";
import dayjs from "dayjs";

// Store 연결
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

// 날짜 초기값 설정
const dateRange = ref([
  dayjs().startOf("month").toDate(),
  dayjs().endOf("month").toDate(),
]);

// 상태 변수
const modalVisible = ref(false);
const selectedBudget = ref(null);
const selectedCategory = ref("");

// 계산된 값
const groupedBudgets = computed(() => transactionStore.groupByDate);
const summary = computed(() => transactionStore.summary);
const incomeCategories = computed(() => categoryStore.incomeCategories);
const expenseCategories = computed(() => categoryStore.expenseCategories);

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
  const modal = new bootstrap.Modal(document.getElementById("modifyModal"));
  modal.show();
  modalVisible.value = true;
}

async function deleteBudget(id) {
  await transactionStore.deleteBudget(id);
  console.log("삭제 요청 ID:", id);
}

function moveMonth(offset) {
  const currentStart = dayjs(dateRange.value[0]);
  const newStart = currentStart.add(offset, "month").startOf("month");
  const newEnd = newStart.endOf("month");

  dateRange.value = [newStart.toDate(), newEnd.toDate()];
  applyFilters();
}

function updateCategory() {
  transactionStore.setCategoryFilter(selectedCategory.value);
}

function applyFilters() {
  const [start, end] = dateRange.value;
  if (!start || !end) return;

  transactionStore.setDateRange(
    dayjs(start).format("YYYY-MM-DD"),
    dayjs(end).format("YYYY-MM-DD")
  );
  transactionStore.setCategoryFilter(selectedCategory.value);
}

function format(value) {
  return parseInt(value).toLocaleString() + "원";
}
</script>

<template>
  <div class="transaction-page font-hakgyo">
    <div class="filter-bar font-hakgyo">
      <div class="day-filter">
        <button @click="moveMonth(-1)">
          <i class="fa fa-chevron-left" aria-hidden="true"></i>
        </button>
        <VueDatePicker
          v-model="dateRange"
          range
          format="yyyy-MM-dd"
          :teleport="true"
          :clearable="false"
          :enable-time-picker="false"
          @update:model-value="applyFilters"
          class="date-picker"
        />
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
    <!-- 거래 추가 버튼(항상 같은 위치에 고정시키기) -->
    <button
      type="button"
      class="btn rounded-pill px-4 py-2 text-black d-flex align-items-center gap-2"
      style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        background-color: #b3e5fc;
      "
      @click="openAddModal"
      data-bs-toggle="modal"
      data-bs-target="#addModal"
    >
      <i class="fa-solid fa-pen-to-square"></i> 거래 추가
    </button>

    <Teleport to="body">
      <TransactionModal
        @close="modalVisible = false"
        @added="transactionStore.fetchBudgets()"
      />
      <TransactionEditModal
        :selectedBudget="selectedBudget"
        @close="modalVisible = false"
        @updated="
          (updatedBudget) =>
            transactionStore.updateBudgets(updatedBudget.id, updatedBudget)
        "
      />
    </Teleport>
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
.day-filter {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  gap: 8px;
  font-size: 30px;
  font-weight: bold;
}
.day-filter button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
.date-picker {
  max-width: 260px;
  font-size: 16px;
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
