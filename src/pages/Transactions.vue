<template>
  <div class="transaction-page font-hakgyo">
    <!-- 날짜 및 필터 -->
    <div class="filter-bar font-hakgyo">
      <div class="day-title">
        {{ dayjs(dateRange[0]).format("YYYY.MM.DD") }} ~
        {{ dayjs(dateRange[1]).format("YYYY.MM.DD") }} / 총
        {{ transactionStore.filteredBudgets.length }}건
      </div>

      <div class="filters">
        <!-- ✅ 날짜 선택 -->
        <div class="custom-date-container">
          <button @click="moveMonth(-1)" class="arrow-btn">
            <i class="fa fa-chevron-left"></i>
          </button>
          <VueDatePicker
            v-model="dateRange"
            range
            format="yyyy-MM-dd"
            :teleport="true"
            :clearable="false"
            :enable-time-picker="false"
            @update:model-value="applyFilters"
            class="date-picker-box"
          />
          <button @click="moveMonth(1)" class="arrow-btn">
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>

        <!-- ✅ 카테고리 필터 -->
        <div class="category-filter">
          <button class="btn btn-blue" @click="openCategoryModal">
            카테고리 선택
          </button>
        </div>
      </div>
    </div>

    <!-- ✅ 선택된 카테고리 뱃지 -->
    <div class="category-box font-hakgyo" v-if="selectedCategories.length">
      <div class="category-badge-wrapper">
        <span
          v-for="category in sortedSelectedCategories"
          :key="category.id"
          :class="[
            'category-badge',
            category.type === 'income' ? 'income' : 'expense',
          ]"
        >
          {{ category.name }}
        </span>
      </div>
    </div>

    <!-- 요약 -->
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

    <!-- 거래 리스트 -->
    <TransactionList
      :transactions="groupedBudgets"
      @edit="openEditModal"
      @delete="deleteBudget"
    />

    <!-- 거래 추가 버튼 -->
    <button
      type="button"
      class="btn rounded-pill px-4 py-2 text-black d-flex align-items-center gap-2 font-hakgyo"
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

    <!-- 모달 -->
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
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import * as bootstrap from "bootstrap";

import { useTransactionStore } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";

import VueDatePicker from "@vuepic/vue-datepicker";
import TransactionList from "@/components/Transaction/TransactionList.vue";
import TransactionModal from "@/components/Transaction/TransactionModal.vue";
import TransactionEditModal from "@/components/Transaction/TransactionEditModal.vue";
import CategoryFilterModal from "@/components/Transaction/CategoryFilterModal.vue";

// 스토어
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

// 날짜 필터 초기값
const dateRange = ref([
  dayjs().startOf("month").toDate(),
  dayjs().endOf("month").toDate(),
]);

const modalVisible = ref(false);
const selectedBudget = ref(null);
const selectedCategories = ref([]);
const categoryModalVisible = ref(false);

// 계산된 값
const groupedBudgets = computed(() => transactionStore.groupByDate);
const summary = computed(() => transactionStore.summary);
const sortedSelectedCategories = computed(() => {
  return [...selectedCategories.value].sort((a, b) => {
    if (a.type === b.type) return 0;
    return a.type === "income" ? -1 : 1;
  });
});

const selectedCategoryLabel = computed(() =>
  selectedCategories.value.map((c) => c.name).join(" | ")
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
  const modal = new bootstrap.Modal(document.getElementById("modifyModal"));
  modal.show();
  modalVisible.value = true;
}

async function deleteBudget(id) {
  const confirmed = window.confirm("삭제하시겠습니까?");
  if (!confirmed) return;
  await transactionStore.deleteBudget(id);
}

function moveMonth(offset) {
  const currentStart = dayjs(dateRange.value[0]);
  const newStart = currentStart.add(offset, "month").startOf("month");
  const newEnd = newStart.endOf("month");
  dateRange.value = [newStart.toDate(), newEnd.toDate()];
  applyFilters();
}

function applyFilters() {
  const [start, end] = dateRange.value;
  if (!start || !end) return;
  transactionStore.setDateRange(
    dayjs(start).format("YYYY-MM-DD"),
    dayjs(end).format("YYYY-MM-DD")
  );
  transactionStore.setCategoryFilter([...selectedCategories.value]);
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
  font-size: 16px;
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

/* 작은 화면 */
@media (min-width: 640px) {
  .day-title {
    font-size: 22px;
  }

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
  min-height: 40px;
}

.date-picker-box {
  width: 260px;
  font-size: 15px;
  border: none !important;
  box-shadow: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.date-picker-box ::v-deep(.dp__input) {
  border: none !important;
  background: transparent !important;
  font-size: 16px;
  text-align: center !important;
  color: #333;
  width: 100%;
}
.date-picker-box ::v-deep(svg) {
  display: none !important;
}

.arrow-btn {
  background: none;
  border: none;
  color: #4285f4;
  font-size: 16px;
  cursor: pointer;
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

/* 모바일(640px 이하)에서 summary를 세로 정렬 */
@media (max-width: 640px) {
  .summary {
    flex-direction: column;
    align-items: center;
  }

  .summary-box {
    width: 100%;
    max-width: 360px;
  }
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
.category-badge-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.category-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  display: inline-flex;
  align-items: center;
  border: 1px solid;
}
.category-badge.income {
  background-color: #e6f7ff;
  color: #0077cc;
  border-color: #91d5ff;
}
.category-badge.expense {
  background-color: #fff1f0;
  color: #d4380d;
  border-color: #ffa39e;
}
</style>
