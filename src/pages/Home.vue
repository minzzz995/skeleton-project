<!-- <template>
  <Sidebar />
  <main>
    <section class="summary">
      - 이번 달 수입: 계산된 수입합계 - 이번 달 지출: 계산된 지출합계 - 이번 달
      순이익: 수입 합계 - 지출 합계계
    </section>

    <section class="chart">
      <BarChart :data="monthlySummary" />
    </section>

    <section class="recent">
      - 최근 거래 5개
      <ul>
        <li v-for="item in latestTransactions">{{ item }}</li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBudgetStore } from '@/stores/budgetStore'
import Sidebar from '@/components/Sidebar.vue'
import BarChart from '@/components/BarChart.vue'

const store = useBudgetStore()

onMounted(() => {
  store.fetchBudgets()
})

const monthlySummary = computed(() => {
  - store.budgets에서 월별로 그룹화하고 수입/지출 합계 정리
})

const thisMonthTotal = computed(() => {
  - 현재 월의 수입, 지출, 순이익 계산
})

const latestTransactions = computed(() => {
  - budgets에서 날짜 기준 내림차순 정렬 후 5개 선택
})
</script> -->
