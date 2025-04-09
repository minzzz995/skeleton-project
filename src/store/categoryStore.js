import { defineStore } from "pinia";
import { get } from "@/services/api";

export const useCategoryStore = defineStore("categoryStore", {
  state: () => ({
    incomeCategories: [],
    expenseCategories: [],
  }),

  actions: {
    async fetchCategories() {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          get("incomecategory"),
          get("expensecategory"),
        ]);
        this.incomeCategories = incomeRes;
        this.expenseCategories = expenseRes;
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
