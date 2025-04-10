<template>
  <div class="transaction-page font-hakgyo">
    <div class="filter-bar font-hakgyo">
      <div class="day-title">
        {{ dayjs(dateRange[0]).format("YYYY.MM.DD") }} ~
        {{ dayjs(dateRange[1]).format("YYYY.MM.DD") }} / 총
        {{ transactionStore.filteredBudgets.length }}건
      </div>
      <div class="filters">
        <div class="custom-date-container">
          <button @click="moveMonth(-1)" class="arrow-btn">
            <i class="fa fa-chevron-left"></i>
          </button>
          <div class="custom-date-display">
            {{ dayjs(dateRange[0]).format("YYYY-MM-DD") }} -
            {{ dayjs(dateRange[1]).format("YYYY-MM-DD") }}
          </div>
          <button @click="moveMonth(1)" class="arrow-btn">
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>
        <div class="category-filter">
          <button class="btn btn-blue" @click="openCategoryModal">
            {{ selectedCategory || "카테고리 선택" }}
          </button>
        </div>
      </div>
    </div>
    <div class="category-box font-hakgyo" v-if="selectedCategories.length">
      {{ selectedCategoryLabel }}
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
      <CategoryFilterModal
        v-if="categoryModalVisible"
        :modelValue="selectedCategories"
        @selected="onCategorySelected"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { useTransactionStore } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";
import TransactionList from "@/components/Transaction/TransactionList.vue";
import TransactionModal from "@/components/Transaction/TransactionModal.vue";
import TransactionEditModal from "@/components/Transaction/TransactionEditModal.vue";
import CategoryFilterModal from "@/components/Transaction/CategoryFilterModal.vue";
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import * as bootstrap from "bootstrap";

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const selectedCategoryLabel = computed(() =>
  selectedCategories.value.map((c) => c.name).join(" | ")
);
const dateRange = ref([
  dayjs().startOf("month").toDate(),
  dayjs().endOf("month").toDate(),
]);

const modalVisible = ref(false);
const selectedBudget = ref(null);
const selectedCategories = ref([]);

const categoryModalVisible = ref(false);

const groupedBudgets = computed(() => transactionStore.groupByDate);
const summary = computed(() => transactionStore.summary);
const incomeCategories = computed(() => categoryStore.incomeCategories);
const expenseCategories = computed(() => categoryStore.expenseCategories);

onMounted(async () => {
  await transactionStore.fetchBudgets();
  await categoryStore.fetchCategories();
  applyFilters();
});

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
function openCategoryModal() {
  categoryModalVisible.value = true;
}

function onCategorySelected(categories) {
  selectedCategories.value = categories;
  categoryModalVisible.value = false;
  transactionStore.setCategoryFilter(categories);
}
</script>

<style scoped>
.btn-blue {
  border: 2px solid #b4daff;
  border-radius: 12px;
  background-color: white;
  color: #000;
}

.btn-blue:hover {
  border: 2px solid #b4daff;
  background-color: #e6f3ff;
  color: #000;
}

.transaction-page {
  padding: 20px;
  font-family: "Pretendard", sans-serif;
  background-color: #fff;
}

.day-title {
  text-align: center;
  font-size: 22px;
  font-weight: 500;
  color: #444;
  margin-bottom: 10px;
}

.filters {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

@media (min-width: 640px) {
  .filters {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}

.custom-date-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 2px solid #cce7ff;
  border-radius: 12px;
  padding: 8px 16px;
  gap: 12px;
}

.custom-date-display {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.arrow-btn {
  background: none;
  border: none;
  color: #4285f4;
  font-size: 16px;
  cursor: pointer;
}

.category-filter select {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

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
.category-box {
  margin: 12px auto 20px auto;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  color: #333;
  max-width: 80%;
  font-size: 16px;
}
</style>
