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
  start: now.startOf('month').format('YYYY-MM-DD'),
  end: now.format('YYYY-MM-DD'),
});

// 상태 변수
const modalVisible = ref(false);
const selectedTransaction = ref(null);
const selectedCategory = ref('');
const showStartPicker = ref(false);
const showEndPicker = ref(false);

// 계산된 값
const incomeCategories = computed(() => categoryStore.incomeCategories);
const expenseCategories = computed(() => categoryStore.expenseCategories);

// 초기 데이터 로딩
onMounted(async () => {
  //await transactionStore.fetchTransactions()
  await categoryStore.fetchCategories();
  //applyFilters();
});

// 메서드 정의
</script>

<template>
  <div class="transaction-page">
    <div class="filter-bar">
      <div class="day-filer">
        <button @click="moveMonth(-1)">
          <i class="fa fa-chevron-left" aria-hidden="true"></i>
        </button>
        <span>2025.02.01</span
        ><!-- <span>{{ formattedStart }}</span> -->
        ~
        <span>2025.02.10</span
        ><!-- <span>{{ formattedEnd }}</span> -->
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
    <div class="summary">
      <div class="summary-box">
        <p>수입</p>
        200<!-- {{ format(summary.income) }} -->
      </div>
      <div class="summary-box">
        <p>지출</p>
        200<!-- {{ format(summary.income) }} -->
      </div>
      <div class="summary-box">
        <p>순이익</p>
        200<!-- {{ format(summary.income) }} -->
      </div>
    </div>
    <TransactionList
      :transactions="groupTransections"
      @edit="openEditModal"
      @delete="deleteTransaction"
    />
    <button class="add-btn" @click="openAddModal">거래 추가</button>
    <TransactionModal
      v-if="modalVisible"
      :editTarget="selectedTransaction"
      @close="modalVisible = false"
    />
  </div>
</template>

<style scoped></style>
