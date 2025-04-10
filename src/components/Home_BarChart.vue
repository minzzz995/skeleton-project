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
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useTransactionStore } from '@/store/transactionStore';
import ApexCharts from 'vue3-apexcharts';

const store = useTransactionStore();
const isMobile = ref(window.innerWidth < 768);

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

// 최근 12개월 또는 4개월 목록 생성
const recentMonths = computed(() => {
  const count = isMobile.value ? 4 : 12;
  const months = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    const label = `${String(d.getFullYear()).slice(2)}.${String(
      d.getMonth() + 1
    ).padStart(2, '0')}`;
    months.push({ key, label });
  }
  return months;
});

// 데이터 유무 관계없이 전체 월에 대한 수입/지출 세팅
const normalizedSummary = computed(() => {
  const summaryMap = {};
  store.monthlySummary.forEach((item) => {
    summaryMap[item.month] = item;
  });

  return recentMonths.value.map((month) => {
    const matched = summaryMap[month.key];
    return {
      month: month.label,
      income: matched ? matched.income : 0,
      expense: matched ? matched.expense : 0,
    };
  });
});

const series = computed(() => [
  { name: '수입', data: normalizedSummary.value.map((m) => m.income) },
  { name: '지출', data: normalizedSummary.value.map((m) => m.expense) },
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
    categories: normalizedSummary.value.map((m) => m.month),
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
