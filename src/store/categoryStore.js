import { defineStore } from "pinia";
import { getCategories } from "@/services/api.js";

export const useCategoryStore = defineStore("categoryStore", {
  state: () => ({
    incomeCategories: [],
    expenseCategories: [],
  }),

  actions: {
    async fetchCategories() {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          axios.get("/incomecategory"),
          axios.get("/expensecategory"),
        ]);
        this.incomeCategories = incomeRes.data;
        this.expenseCategories = expenseRes.data;
      } catch (error) {
        console.error("카테고리 불러오기 실패:", error);
      }
    },
  },

  getters: {
    allCategories(state) {
      return [
        ...state.incomeCategories.map((c) => c.name),
        ...state.expenseCategories.map((c) => c.name),
      ];
    },
  },
});
