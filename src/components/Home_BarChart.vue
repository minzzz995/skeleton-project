<
<template>
  <div class="font-dahaeng">
    <apexchart
      type="bar"
      height="200"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTransactionStore } from '@/store/transactionStore';
import ApexCharts from 'vue3-apexcharts';

const store = useTransactionStore();

// 현재 날짜를 기준으로 최근 12개월간의 목록을 생성하기
const recent12Months = computed(() => {
  const months = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    months.push({
      key,
      label: `${d.getMonth() + 1}월`,
    });
  }
  return months;
});

// 데이터가 있는 월만 필터링하여 보여주기
const filteredSummary = computed(() => {
  const keys = recent12Months.value.map((m) => m.key);
  return store.monthlySummary.filter((item) => keys.includes(item.month));
});

const series = computed(() => [
  { name: '수입', data: filteredSummary.value.map((m) => m.income) },
  { name: '지출', data: filteredSummary.value.map((m) => m.expense) },
]);

const chartOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    fontFamily: 'HakgyoansimDunggeunmiso, sans-serif',
  },
  plotOptions: {
    bar: { borderRadius: 4, columnWidth: '40%' },
  },
  dataLabels: {
    enabled: false,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
    },
  },
  colors: ['#b9e3b9', '#d5b6d5'],
  xaxis: {
    categories: filteredSummary.value.map(
      (m) => `${parseInt(m.month.split('-')[1])}월`
    ),
    labels: {
      style: {
        fontSize: '14px',
        fontWeight: 600,
      },
    },
  },
  legend: {
    position: 'top',
    labels: {
      colors: '#000',
      useSeriesColors: false,
      fontSize: '14px',
      fontWeight: 700,
    },
  },
  tooltip: {
    y: {
      formatter: (val) => `${val.toLocaleString()}원`,
    },
  },
}));
</script>
>
