import { defineStore } from "pinia";
import { get, post, put, remove } from "@/services/api";
import dayjs from "dayjs";

export const useTransactionStore = defineStore("transaction", {
  state: () => ({
    budgets: [],
    categoryFilter: null,
    dateRange: { start: null, end: null },
  }),
  actions: {
    async fetchBudgets() {
      // db.json에서 불러옴
      this.budgets = await get("budget");
    },
    async addBudgets(data) {
      // 거래 추가
      const newItem = await post("budget", data);
      this.budgets.push(newItem);
    },
    async updateBudgets(id, updatedData) {
      // 거래 내역 수정
      await put(`budget/${id}`, updatedData);
      const idx = this.budgets.findIndex((t) => t.id === id);
      if (idx !== -1) this.budgets[idx] = updatedData;
    },
    async deleteBudget(id) {
      // 거래 삭제
      await remove(`budget/${id}`);
      this.budgets = this.budgets.filter((t) => t.id !== id);
    },
    setCategoryFilter(category) {
      // 카테고리 필터 적용
      this.categoryFilter = category;
    },
    setDateRange(start, end) {
      // 기간 필터 적용
      this.dateRange = { start, end };
    },
  },
  getters: {
    thisMonthIncome: (state) => {
      const now = new Date();
      return state.budgets
        .filter(
          (i) =>
            new Date(i.date).getMonth() === now.getMonth() &&
            i.type === "income"
        )
        .reduce((acc, cur) => acc + parseInt(cur.amount), 0);
    },
    thisMonthExpense: (state) => {
      const now = new Date();
      return state.budgets
        .filter(
          (i) =>
            new Date(i.date).getMonth() === now.getMonth() &&
            i.type === "expense"
        )
        .reduce((acc, cur) => acc + parseInt(cur.amount), 0);
    },
    latestFive: (state) =>
      [...state.budgets]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    monthlySummary: (state) => {
      const grouped = {};
      state.budgets.forEach((item) => {
        const d = new Date(item.date);
        const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        if (!grouped[month]) grouped[month] = { income: 0, expense: 0 };
        grouped[month][item.type] += parseInt(item.amount);
      });
      return Object.entries(grouped).map(([month, value]) => ({
        month,
        ...value,
      }));
    },
    filteredBudgets: (state) => {
      // 날짜 범위와 카테고리 조건이 모두 만족되는 거래를 걸러냄
      return state.budgets.filter((t) => {
        const date = dayjs(t.date);
        const inRange =
          (!state.dateRange.start ||
            date.isAfter(dayjs(state.dateRange.start).subtract(1, "day"))) &&
          (!state.dateRange.end ||
            date.isBefore(dayjs(state.dateRange.end).add(1, "day")));
        const matchesCategory =
          !state.categoryFilter || t.category === state.categoryFilter;
        return inRange && matchesCategory;
      });
    },
    groupByDate: (state) => {
      // 필터된 거래들을 MM/DD 형태로 묶어 Object로 반환
      const grouped = {};
      const data = useTransactionStore().filteredBudgets;
      data.forEach((t) => {
        const key = dayjs(t.date).format("MM/DD");
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(t);
      });
      return grouped;
    },
    summary: (state) => {
      // 필터링된 거래 기준으로 수입/지출/순수익을 계산
      let income = 0,
        expense = 0;
      const data = useTransactionStore().filteredBudgets;
      data.forEach((t) => {
        const amt = parseInt(t.amount);
        if (t.type === "income") income += amt;
        else expense += amt;
      });
      return { income, expense, net: income - expense };
    },
  },
});
