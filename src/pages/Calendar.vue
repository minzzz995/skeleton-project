<template>
  <div class="d-flex flex-column flex-md-row gap-4 p-4 font-hakgyo">
    <!-- 달력 -->
    <div class="calendar-wrapper shadow-sm bg-white rounded p-3">
      <VueDatePicker
        v-model="selectedDate"
        locale="ko"
        :enable-time-picker="false"
        :inline="true"
        auto-apply
      >
        <!-- 날짜 셀 커스터마이징 -->
        <template #day="{ day, date }">
          <div
            class="day-cell p-1 d-flex flex-column align-items-center justify-content-center"
          >
            <div class="fw-semibold">{{ day }}</div>
            <div v-if="hasData(date)" class="mt-1 text-center w-100">
              <div v-if="getIncome(date)" class="text-success small">
                +{{ getIncome(date).toLocaleString() }}
              </div>
              <div v-if="getExpense(date)" class="text-danger small">
                -{{ getExpense(date).toLocaleString() }}
              </div>
            </div>
          </div>
        </template>
      </VueDatePicker>
    </div>

    <!-- 선택한 날짜 내역 표시 -->
    <div class="flex-grow-1 border rounded p-4 bg-white shadow-sm">
      <h5 class="fw-bold mb-3">{{ formatDate(selectedDate) }}의 입출금 내역</h5>
      <ul v-if="filteredTransactions.length">
        <li
          v-for="(item, index) in filteredTransactions"
          :key="index"
          :class="item.type === 'income' ? 'text-success' : 'text-danger'"
        >
          {{ item.type === 'income' ? '입금' : '출금' }} - {{ item.category }}:
          ₩ {{ parseInt(item.amount).toLocaleString() }} ({{
            item.detailcategory || ''
          }})
        </li>
      </ul>
      <p v-else class="text-muted">내역이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref, computed, onMounted } from 'vue';
import * as api from '@/services/api';
import { formatDate as toStr } from '@/utils/formatDate';

const selectedDate = ref(new Date());
const allTransactions = ref([]);

onMounted(async () => {
  try {
    const res = await api.get('budget');
    allTransactions.value = res;
  } catch (err) {
    console.error('데이터 로딩 실패', err);
  }
});

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('ko-KR') : '';

const filteredTransactions = computed(() => {
  const selected = toStr(selectedDate.value).split(' ')[0]; // YYYY-MM-DD
  return allTransactions.value.filter((t) => t.date.startsWith(selected));
});

const getIncome = (date) => {
  const key = date.toISOString().split('T')[0];
  return allTransactions.value
    .filter((i) => i.date.startsWith(key) && i.type === 'income')
    .reduce((sum, i) => sum + parseInt(i.amount), 0);
};

const getExpense = (date) => {
  const key = date.toISOString().split('T')[0];
  return allTransactions.value
    .filter((i) => i.date.startsWith(key) && i.type === 'expense')
    .reduce((sum, i) => sum + parseInt(i.amount), 0);
};

const hasData = (date) => {
  return getIncome(date) > 0 || getExpense(date) > 0;
};
</script>

<style scoped>
::v-deep(.custom-day) {
  width: 68px;
  height: 68px;
  border-radius: 8px;
  padding: 6px 4px;
  background-color: #f9f9f9;
  transition: background-color 0.2s ease;
}

::v-deep(.custom-day:hover) {
  background-color: #e3f2fd;
}

.calendar-wrapper {
  min-width: 460px;
  max-width: 520px;
}

.day-cell {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.dp__calendar_row {
  gap: 6px;
  justify-content: center;
}

.dp__calendar {
  gap: 8px;
}
</style>
