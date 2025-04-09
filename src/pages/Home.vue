<template>
  <div class="d-flex" style="height: 100vh; position: relative">
    <div class="flex-grow-1 bg-white p-5 overflow-auto">
      <!-- 해당 월 수입/지출/순이익 카드 -->
      <div class="row row-cols-1 row-cols-md-3 g-4 mb-4">
        <div class="col">
          <div
            class="text-center rounded-4 p-4 text-black"
            style="background-color: #c8e6c9"
          >
            <div>이번 달 수입</div>
            <div class="fw-bold fs-5">₩ {{ income.toLocaleString() }}</div>
          </div>
        </div>
        <div class="col">
          <div
            class="text-center rounded-4 p-4 text-black"
            style="background-color: #d9c4e6"
          >
            <div>이번 달 지출</div>
            <div class="fw-bold fs-5">₩ {{ expense.toLocaleString() }}</div>
          </div>
        </div>
        <div class="col">
          <div
            class="text-center rounded-4 p-4"
            style="background-color: #f3f3f3"
          >
            <div>이번 달 순이익</div>
            <div class="fw-bold fs-5">
              ₩ {{ (income - expense).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>

      <!-- 월 별 차트 보여주기기 -->
      <div class="rounded-4 border p-4 mb-5" style="border: 1px solid #ccc">
        <h6 class="fw-semibold mb-3">월 별 수입/지출</h6>
        <BarChart :data="monthlySummary" />
      </div>

      <!-- 거래 내역 (최근 5개만 보여주기) -->
      <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-semibold">거래 내역</h6>
          <button
            class="btn btn-sm rounded-pill px-3 py-1 text-black"
            style="background-color: #b3e5fc"
            @click="goToTransactions"
          >
            + 더보기
          </button>
        </div>
        <table class="table align-middle">
          <thead>
            <tr class="table-light">
              <th>날짜</th>
              <th>금액</th>
              <th>카테고리</th>
              <th>세부 카테고리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in latestTransactions" :key="item.id">
              <td>{{ formatDate(item.date) }}</td>
              <td
                :class="{
                  'text-success': item.type === 'income',
                  'text-danger': item.type === 'expense',
                }"
              >
                {{ item.type === 'income' ? '+' : '-' }}
                {{ parseInt(item.amount).toLocaleString() }}
              </td>

              <td>{{ item.category }}</td>
              <td>{{ item.detailcategory }}</td>
            </tr>
          </tbody>
        </table>
      </div>

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
        data-bs-toggle="modal"
        data-bs-target="#addModal"
      >
        <i class="fa-solid fa-pen-to-square"></i> 거래 추가
      </button>

      <Teleport to="body">
        <TransactionModal
          @close="showModal = false"
          @added="store.fetchBudgets()"
        />
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import BarChart from '@/components/Home_BarChart.vue';
import Sidebar from '@/components/Sidebar.vue';
import TransactionModal from '@/components/Transaction/TransactionModal.vue';
import { formatDate } from '@/utils/formatDate';
import { useTransactionStore } from '@/store/transactionStore';

const router = useRouter();
const store = useTransactionStore();

onMounted(() => store.fetchBudgets());

const income = computed(() => store.thisMonthIncome);
const expense = computed(() => store.thisMonthExpense);
const monthlySummary = computed(() => store.monthlySummary);
const latestTransactions = computed(() => store.latestFive);

const goToTransactions = () => {
  router.push('/transactions');
};
</script>
