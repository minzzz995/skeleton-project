<script setup>
import { defineProps, defineEmits, computed } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  transactions: {
    type: Object,
    required: true, // 'MM/DD': [ { ... }, { ... } ] 형식
  },
});

const emit = defineEmits(["edit", "delete"]);

const transactionsWithTotal = computed(() => {
  return Object.entries(props.transactions)
    .sort(([a], [b]) => (dayjs(a, "MM/DD").isAfter(dayjs(b, "MM/DD")) ? 1 : -1))
    .map(([date, list]) => {
      const sorted = [...list].sort((a, b) => {
        const timeA = dayjs(a.date);
        const timeB = dayjs(b.date);

        if (timeA.isBefore(timeB)) return -1;
        if (timeA.isAfter(timeB)) return 1;

        return a.detailcategory.localeCompare(b.detailcategory);
      });

      const total = sorted.reduce((sum, t) => {
        const amt = parseInt(t.amount);
        return t.type === "income" ? sum + amt : sum - amt;
      }, 0);

      return {
        date,
        total,
        transactions: sorted,
      };
    });
});

function format(value) {
  return parseInt(value).toLocaleString() + "원";
}

function getWeekday(dateStr) {
  const day = dayjs(dateStr, "MM/DD").day();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return weekdays[day];
}
</script>

<template>
  <div class="transaction-list">
    <div
      class="transaction-group"
      v-for="group in transactionsWithTotal"
      :key="group.date"
    >
      <!-- 날짜 보여주는 곳 -->
      <div class="group-header">
        <span class="date">{{ group.date }} {{ getWeekday(group.date) }}</span>
        <span class="total">{{ format(group.total) }}</span>
      </div>
      <!-- 날짜별 거래 내역 보여주는 곳 -->
      <ul class="transactions">
        <li
          class="transaction-item"
          v-for="item in group.transactions"
          :key="item.id"
        >
          <span class="type" :class="item.type">{{
            item.type == "income" ? "수입" : "지출"
          }}</span>
          <span class="category">{{ item.category }}</span>
          <span class="detail">{{ item.detailcategory }}</span>
          <span class="amount" :class="item.type">{{
            format(item.amount)
          }}</span>
          <span class="memo">{{ item.memo }}</span>
          <div class="actions">
            <button @click="$emit('edit', item)">수정</button>
            <button @click="$emit('delete', item.id)">삭제</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* 전체 */
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 전체 한번 더 div */
.transaction-group {
  border-bottom: 1px solid #ccc;
  padding-bottom: 12px;
}

/* 날짜 보여주는 곳 */
.group-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 6px;
  font-weight: bold;
  font-size: 16px;
  color: #333;
  background: #8cdbff;
}

/* 날짜별 거래 내역 보여주는 곳 */
.transactions {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 날짜별 거래 내역 - li */
.transaction-item {
  display: grid;
  grid-template-columns: 14% 10% 20% 12% 30% 14%;
  align-items: center;
  padding: 8px 20px 8px 30px;
  border-bottom: 1px dashed #eee;
  gap: 10px;
}

.info {
  display: flex;
  flex-direction: column;
}

.category {
  font-weight: 600;
  color: #444;
}

.amount {
  font-weight: bold;
}

.memo {
  font-size: 12px;
  color: #777;
}

.income {
  color: #007bff;
}

.expense {
  color: #ff4d4f;
}
.actions button {
  margin-left: 8px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 14px;
}

.actions button:hover {
  color: #333;
}
</style>
