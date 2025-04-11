import { defineStore } from 'pinia';
import { get, post, put, remove } from '@/services/api';
import dayjs from 'dayjs';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    budgets: [],
    categoryFilter: [], // 배열 형태 유지
    dateRange: { start: null, end: null },
  }),

  actions: {
    async fetchBudgets() {
      // budget 데이터 가져오기
      this.budgets = await get('budget');
    },

    async addBudgets(data) {
      const newItem = await post('budget', data);
      this.budgets.push(newItem);
    },

    async updateBudgets(id, updatedData) {
      await put(`budget/${id}`, updatedData);
      const idx = this.budgets.findIndex((t) => t.id === id);
      if (idx !== -1) this.budgets[idx] = updatedData;
    },

    async deleteBudget(id) {
      await remove(`budget/${id}`);
      this.budgets = this.budgets.filter((t) => t.id !== id);
    },

    setCategoryFilter(categories) {
      // selectedCategories 배열을 그대로 세팅
      this.categoryFilter = categories;
    },

    setDateRange(start, end) {
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
            i.type === 'income'
        )
        .reduce((acc, cur) => acc + parseInt(cur.amount), 0);
    },

    thisMonthExpense: (state) => {
      const now = new Date();
      return state.budgets
        .filter(
          (i) =>
            new Date(i.date).getMonth() === now.getMonth() &&
            i.type === 'expense'
        )
        .reduce((acc, cur) => acc + parseInt(cur.amount), 0);
    },

    latestFive: (state) => {
      const now = new Date();
      return [...state.budgets]
        .filter((item) => new Date(item.date) <= now) // 현재 날짜보다 과거 또는 같은 날짜만 포함
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // 최신 순 정렬
        .slice(0, 5); // 상위 5개만 반환
    },

    monthlySummary: (state) => {
      const grouped = {};
      state.budgets.forEach((item) => {
        const d = new Date(item.date);
        const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          '0'
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
      return state.budgets.filter((t) => {
        const date = dayjs(t.date);
        const inRange =
          (!state.dateRange.start ||
            !date.isBefore(state.dateRange.start, 'day')) &&
          (!state.dateRange.end || !date.isAfter(state.dateRange.end, 'day'));

        const matchesCategory =
          state.categoryFilter.length === 0 ||
          state.categoryFilter.some(
            (f) => f.name === t.category && f.type === t.type
          );

        return inRange && matchesCategory;
      });
    },

    groupByDate: (state) => {
      const grouped = {};
      const data = state.filteredBudgets;
      data.forEach((t) => {
        const key = dayjs(t.date).format('YYYY/MM/DD');
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(t);
      });
      return grouped;
    },

    summary: (state) => {
      let income = 0,
        expense = 0;
      const data = state.filteredBudgets;
      data.forEach((t) => {
        const amt = parseInt(t.amount);
        if (t.type === 'income') income += amt;
        else expense += amt;
      });
      return { income, expense, net: income - expense };
    },
  },
});
