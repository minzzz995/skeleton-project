<template>
  <div class="transaction-page font-hakgyo">
    <!-- 날짜 및 필터 -->
    <div class="filter-bar font-hakgyo">
      <div class="day-title">
        {{ dayjs(dateRange[0]).format('YYYY.MM.DD') }} ~
        {{ dayjs(dateRange[1]).format('YYYY.MM.DD') }} / 총
        {{ transactionStore.filteredBudgets.length }}건
      </div>
      <div class="filters">
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
        <div class="category-filter">
          <button class="btn btn-blue" @click="openCategoryModal">
            카테고리 선택
          </button>
        </div>
      </div>
    </div>

    <!-- 선택된 카테고리 뱃지 -->
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
          <button class="remove-btn" @click="removeCategory(category)">
            x
          </button>
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
    <transition-group name="fade-slide" tag="div">
      <TransactionList
        :transactions="visibleGroupedBudgets"
        @edit="openEditModal"
        @delete="deleteBudget"
      />
    </transition-group>

    <!-- 더보기 버튼 -->
    <div v-if="hasMore" class="text-center mt-4">
      <button class="load-more-btn font-hakgyo" @click="loadMore">
        <i class="fa-regular fa-circle-down"></i> 더보기
      </button>
    </div>

    <!-- 스크롤 최상단 이동 버튼 -->
    <button class="scroll-top-btn" @click="scrollToTop">
      <i class="fa-solid fa-arrow-up"></i>
    </button>

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
import { ref, computed, onMounted, nextTick } from 'vue';
import dayjs from 'dayjs';
import * as bootstrap from 'bootstrap';
import { useTransactionStore } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';
import VueDatePicker from '@vuepic/vue-datepicker';
import TransactionList from '@/components/Transaction/TransactionList.vue';
import TransactionModal from '@/components/Transaction/TransactionModal.vue';
import TransactionEditModal from '@/components/Transaction/TransactionEditModal.vue';
import CategoryFilterModal from '@/components/Transaction/CategoryFilterModal.vue';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const dateRange = ref([
  dayjs().startOf('month').toDate(),
  dayjs().endOf('month').toDate(),
]);

const modalVisible = ref(false);
const selectedBudget = ref(null);
const selectedCategories = ref([]);
const categoryModalVisible = ref(false);
const loadCount = ref(1);
const itemsPerLoad = 10;

const sortedSelectedCategories = computed(() => {
  return [...selectedCategories.value].sort((a, b) => {
    if (a.type === b.type) return 0;
    return a.type === 'income' ? -1 : 1;
  });
});

const groupedBudgets = computed(() => transactionStore.groupByDate);
const allDates = computed(() => Object.keys(groupedBudgets.value));
const visibleGroupedBudgets = computed(() => {
  const shownDates = allDates.value.slice(
    0,
    10 + (loadCount.value - 1) * itemsPerLoad
  );
  const result = {};
  shownDates.forEach((date) => {
    result[date] = groupedBudgets.value[date];
  });
  return result;
});
const summary = computed(() => transactionStore.summary);
const hasMore = computed(() => {
  return 10 + (loadCount.value - 1) * itemsPerLoad < allDates.value.length;
});

onMounted(async () => {
  await transactionStore.fetchBudgets();
  await categoryStore.fetchCategories();
  applyFilters();
});

function applyFilters() {
  const [start, end] = dateRange.value;
  if (!start || !end) return;
  const startDay = dayjs(start).startOf('day').format('YYYY-MM-DD');
  const endDay = dayjs(end).endOf('day').format('YYYY-MM-DD');
  transactionStore.setDateRange(startDay, endDay);
  transactionStore.setCategoryFilter([...selectedCategories.value]);
  loadCount.value = 1;
}

function openAddModal() {
  selectedBudget.value = null;
  modalVisible.value = true;
}

function openEditModal(budget) {
  selectedBudget.value = budget;
  modalVisible.value = true;
}

async function deleteBudget(id) {
  const confirmed = window.confirm('삭제하시겠습니까?');
  if (!confirmed) return;
  await transactionStore.deleteBudget(id);
}

function moveMonth(offset) {
  const currentStart = dayjs(dateRange.value[0]);
  const newStart = currentStart.add(offset, 'month').startOf('month');
  const newEnd = newStart.endOf('month');
  dateRange.value = [newStart.toDate(), newEnd.toDate()];
  applyFilters();
}

function openCategoryModal() {
  categoryModalVisible.value = true;
}

function onCategorySelected(categories) {
  selectedCategories.value = categories;
  categoryModalVisible.value = false;
  transactionStore.setCategoryFilter(categories);
  loadCount.value = 1;
}

function removeCategory(category) {
  selectedCategories.value = selectedCategories.value.filter(
    (c) => !(c.name === category.name && c.type === category.type)
  );
  transactionStore.setCategoryFilter([...selectedCategories.value]);
  loadCount.value = 1;
}

function format(value) {
  return parseInt(value).toLocaleString() + '원';
}

async function loadMore() {
  const scrollY = window.scrollY;
  loadCount.value++;
  await nextTick();
  window.scrollTo({ top: scrollY });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  font-family: 'Pretendard', sans-serif;
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
.remove-btn {
  margin-left: 6px;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: bold;
  color: #666;
  cursor: pointer;
}
.remove-btn:hover {
  color: #ff4d4f;
}

.load-more-btn {
  background-color: #b3e5fc;
  color: black;
  border: none;
  padding: 10px 24px;
  font-size: 15px;
  border-radius: 24px;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.load-more-btn:hover {
  background-color: #8cdbff;
  color: white;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.scroll-top-btn {
  position: fixed;
  bottom: 90px;
  right: 20px;
  z-index: 999;
  background-color: #b3e5fc;
  color: black;
  border: none;
  padding: 10px 16px;
  border-radius: 50%;
  font-size: 18px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s;
}
.scroll-top-btn:hover {
  background-color: #8cdbff;
  color: white;
}
</style>
