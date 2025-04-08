import { defineStore } from 'pinia'
import axios from 'axios'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({ budgets: [] }),
  actions: {
    async fetchBudgets() {
      const res = await axios.get('http://localhost:3000/budget')
      this.budgets = res.data
    }
  },
  getters: {
    thisMonthIncome: state => {
      const now = new Date()
      return state.budgets.filter(i => new Date(i.date).getMonth() === now.getMonth() && i.type === 'income')
        .reduce((acc, cur) => acc + parseInt(cur.amount), 0)
    },
    thisMonthExpense: state => {
      const now = new Date()
      return state.budgets.filter(i => new Date(i.date).getMonth() === now.getMonth() && i.type === 'expense')
        .reduce((acc, cur) => acc + parseInt(cur.amount), 0)
    },
    latestFive: state => [...state.budgets].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    monthlySummary: state => {
      const grouped = {}
      state.budgets.forEach(item => {
        const d = new Date(item.date)
        const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!grouped[month]) grouped[month] = { income: 0, expense: 0 }
        grouped[month][item.type] += parseInt(item.amount)
      })
      return Object.entries(grouped).map(([month, value]) => ({ month, ...value }))
    }
  }
})
