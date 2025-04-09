// Home.vue
<template>
  <div class="d-flex vh-100">
    <Sidebar :current="'dashboard'" />

    <div class="flex-grow-1 p-4 bg-light overflow-auto">
      <!-- 수입/지출/순이익 카드 -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="card text-center bg-light-purple p-3">
            <div>이번 달 수입</div>
            <strong>₩ {{ income.toLocaleString() }}</strong>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center bg-light-green p-3">
            <div>이번 달 지출</div>
            <strong>₩ {{ expense.toLocaleString() }}</strong>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center bg-light-gray p-3">
            <div>이번 달 순이익</div>
            <strong>₩ {{ (income - expense).toLocaleString() }}</strong>
          </div>
        </div>
      </div>

      <!-- 월별 수입/지출 차트 -->
      <div class="card mb-4 p-4">
        <h5>월 별 수입/지출</h5>
        <BarChart :data="monthlySummary" />
      </div>

      <!-- 거래 내역 -->
      <div class="card p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>거래 내역</h5>
          <button class="btn btn-outline-primary btn-sm">+ 더보기</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>금액</th>
              <th>카테고리</th>
              <th>세부 카테고리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in latestTransactions" :key="item.id">
              <td>{{ formatDate(item.date) }}</td>
              <td>₩ {{ parseInt(item.amount).toLocaleString() }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.detailcategory }}</td>
            </tr>
          </tbody>
        </table>
        <button
          class="btn btn-info mt-3 float-end"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
        >
          ✏ 거래 추가
        </button>
        <TransactionModal />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useTransactionStore } from "@/store/transactionStore";
import Sidebar from "@/components/Sidebar.vue";
import BarChart from "@/components/BarChart.vue";
import TransactionModal from "@/components/Transaction/TransactionModal.vue";
import { formatDate } from "@/utils/formatDate";

const store = useTransactionStore();

onMounted(() => {
  store.fetchBudgets();
});

const income = computed(() => store.thisMonthIncome);
const expense = computed(() => store.thisMonthExpense);
const monthlySummary = computed(() => store.monthlySummary);
const latestTransactions = computed(() => store.latestFive);
</script>

<style scoped>
.bg-light-purple {
  background-color: #e1bee7;
}
.bg-light-green {
  background-color: #c8e6c9;
}
.bg-light-gray {
  background-color: #f3f3f3;
}
</style>
