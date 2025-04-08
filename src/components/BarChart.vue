<template>
    <apexchart type="bar" height="250" :options="chartOptions" :series="series" />
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import ApexCharts from 'vue3-apexcharts'
  import { useTransactionStore } from '@/store/transactionStore'
  
  const store = useTransactionStore()
  
  const series = computed(() => [
    { name: '수입', data: store.monthlySummary.map(m => m.income) },
    { name: '지출', data: store.monthlySummary.map(m => m.expense) }
  ])
  
  const chartOptions = computed(() => ({
    chart: { toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 5, columnWidth: '45%' } },
    colors: ['#90EE90', '#D8BFD8'],
    xaxis: {
      categories: store.monthlySummary.map(m => `${parseInt(m.month.split('-')[1])}월`)
    },
    tooltip: {
      y: { formatter: val => `${val.toLocaleString()}원` }
    },
    legend: { position: 'top' }
  }))
  </script>
  