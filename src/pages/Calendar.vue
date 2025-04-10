<template>
  <div
    class="container-fluid py-4 font-hakgyo d-flex flex-column align-items-center"
  >
    <!-- 캘린더 -->
    <div
      class="calendar-wrapper bg-white rounded shadow-sm p-3 w-100 mb-4"
      style="max-width: 900px"
    >
      <!-- 헤더 -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-outline-secondary btn-sm" @click="prevMonth">
          이전달
        </button>
        <h5 class="fw-bold m-0">
          {{ currentYear }}년 {{ currentMonth + 1 }}월
        </h5>
        <button class="btn btn-outline-secondary btn-sm" @click="nextMonth">
          다음달
        </button>
      </div>

      <!-- 요일 헤더 + 날짜 -->
      <div class="calendar-grid">
        <div class="day-name" v-for="day in dayNames" :key="day">{{ day }}</div>
        <div
          v-for="(date, index) in calendarDays"
          :key="index"
          class="calendar-cell"
          :class="{
            'bg-light': date.isCurrentMonth,
            'bg-secondary text-white': !date.isCurrentMonth,
            'border border-primary': isSameDate(date.date, selectedDate),
          }"
          @click="selectDate(date.date)"
        >
          <div class="fw-bold">{{ date.date.getDate() }}</div>
          <div v-if="hasData(date.date)" class="mt-1 text-center">
            <div v-if="getIncome(date.date)" class="text-success small">
              +{{ getIncome(date.date).toLocaleString() }}
            </div>
            <div v-if="getExpense(date.date)" class="text-danger small">
              -{{ getExpense(date.date).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 입출금 내역 (항상 하단에 고정) -->
    <div
      class="bg-white rounded shadow-sm p-4 transaction-box w-100"
      style="max-width: 900px"
    >
      <h5 class="fw-bold mb-3">{{ formatDate(selectedDate) }}의 입출금 내역</h5>
      <ul v-if="filteredTransactions.length">
        <li
          v-for="(item, i) in filteredTransactions"
          :key="i"
          :class="item.type === 'income' ? 'text-success' : 'text-danger'"
        >
          {{ item.type === 'income' ? '입금' : '출금' }} - {{ item.category }}:
          ₩{{ parseInt(item.amount).toLocaleString() }} (
          {{ item.detailcategory || '' }} )
        </li>
      </ul>
      <p v-else class="text-muted">내역이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import * as api from '@/services/api';
import { formatDate as toStr } from '@/utils/formatDate';

const selectedDate = ref(new Date());
const allTransactions = ref([]);

const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

onMounted(async () => {
  const res = await api.get('budget');
  allTransactions.value = res;
});

const formatToLocalYMD = (date) => {
  const local = new Date(date);
  const yyyy = local.getFullYear();
  const mm = String(local.getMonth() + 1).padStart(2, '0');
  const dd = String(local.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`;
};

const isSameDate = (a, b) => formatToLocalYMD(a) === formatToLocalYMD(b);

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentYear.value--;
    currentMonth.value = 11;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentYear.value++;
    currentMonth.value = 0;
  } else {
    currentMonth.value++;
  }
};

const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
const getLastDateOfMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

const calendarDays = computed(() => {
  const days = [];
  const firstDay = getFirstDayOfMonth(currentYear.value, currentMonth.value);
  const lastDate = getLastDateOfMonth(currentYear.value, currentMonth.value);

  const prevMonthLastDate = getLastDateOfMonth(
    currentYear.value,
    currentMonth.value - 1
  );
  for (let i = firstDay - 1; i >= 0; i--) {
    const date = new Date(
      currentYear.value,
      currentMonth.value - 1,
      prevMonthLastDate - i
    );
    days.push({ date, isCurrentMonth: false });
  }

  for (let i = 1; i <= lastDate; i++) {
    const date = new Date(currentYear.value, currentMonth.value, i);
    days.push({ date, isCurrentMonth: true });
  }

  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, i);
    days.push({ date, isCurrentMonth: false });
  }

  return days;
});

const selectDate = (date) => {
  const selected = new Date(date);
  selectedDate.value = selected;

  const selectedYear = selected.getFullYear();
  const selectedMonth = selected.getMonth();

  if (
    selectedYear !== currentYear.value ||
    selectedMonth !== currentMonth.value
  ) {
    currentYear.value = selectedYear;
    currentMonth.value = selectedMonth;
  }
};

const filteredTransactions = computed(() => {
  const selected = formatToLocalYMD(selectedDate.value);
  return allTransactions.value.filter(
    (t) => formatToLocalYMD(t.date) === selected
  );
});

const getIncome = (date) => {
  const key = formatToLocalYMD(date);
  return allTransactions.value
    .filter((i) => formatToLocalYMD(i.date) === key && i.type === 'income')
    .reduce((sum, i) => sum + parseInt(i.amount), 0);
};

const getExpense = (date) => {
  const key = formatToLocalYMD(date);
  return allTransactions.value
    .filter((i) => formatToLocalYMD(i.date) === key && i.type === 'expense')
    .reduce((sum, i) => sum + parseInt(i.amount), 0);
};

const hasData = (date) => getIncome(date) > 0 || getExpense(date) > 0;
</script>

<style scoped>
.calendar-wrapper {
  width: 100%;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
}

.day-name {
  font-weight: bold;
  text-align: center;
  padding: 4px 0;
}

.calendar-cell {
  aspect-ratio: 1 / 1;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 6px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.9rem;
}

.calendar-cell:hover {
  background-color: #e3f2fd;
}

.transaction-box {
  width: 100%;
}

@media (min-width: 1200px) {
  .calendar-wrapper {
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .calendar-cell {
    font-size: 0.75rem;
    padding: 4px;
  }
}
</style>
