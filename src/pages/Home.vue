<template>
  <div
    class="d-flex"
    style="
      height: 100vh;
      font-family: 'NanumDahaeng', sans-serif;
      position: relative;
    "
  >
    <Sidebar />

    <div class="flex-grow-1 bg-white p-5 overflow-auto">
      <!-- 해당 월 수입/지출/순이익 카드 -->
      <div class="d-flex justify-content-between gap-4 mb-4">
        <div
          class="text-center rounded-4 p-4 flex-fill text-white"
          style="background-color: #d9c4e6"
        >
          <div>이번 달 수입</div>
          <div class="fw-bold fs-5">₩ {{ income.toLocaleString() }}</div>
        </div>
        <div
          class="text-center rounded-4 p-4 flex-fill text-white"
          style="background-color: #c8e6c9"
        >
          <div>이번 달 지출</div>
          <div class="fw-bold fs-5">₩ {{ expense.toLocaleString() }}</div>
        </div>
        <div
          class="text-center rounded-4 p-4 flex-fill"
          style="background-color: #f3f3f3"
        >
          <div>이번 달 순이익</div>
          <div class="fw-bold fs-5">
            ₩ {{ (income - expense).toLocaleString() }}
          </div>
        </div>
      </div>

      <!-- 차트 -->
      <div class="rounded-4 border p-4 mb-5" style="border: 1px solid #ccc">
        <h6 class="fw-semibold mb-3">월 별 수입/지출</h6>
        <BarChart :data="monthlySummary" />
      </div>

     

      <!-- 거래 추가 버튼(항상 같은 위치에 고정시키기) -->
      <button
        class="btn rounded-pill px-4 py-2 text-white d-flex align-items-center gap-2"
        style="
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          background-color: #b3e5fc;
        "
        @click="showModal = true"
      >
        <i class="fa-solid fa-pen-to-square"></i> 거래 추가
      </button>

      <Teleport to="body">
        <TransactionModal v-if="showModal" @close="showModal = false" />
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import BarChart from '@/components/BarChart.vue';
import TransactionModal from '@/components/Transaction/TransactionModal.vue';
import { formatDate } from '@/utils/formatDate';
import { useTransactionStore } from '@/store/transactionStore';

const router = useRouter();
const store = useTransactionStore();
const showModal = ref(false);

onMounted(() => store.fetchBudgets());

const income = computed(() => store.thisMonthIncome);
const expense = computed(() => store.thisMonthExpense);
const monthlySummary = computed(() => store.monthlySummary);
const latestTransactions = computed(() => store.latestFive);

const goToTransactions = () => {
  router.push('/transactions');
};
</script>
