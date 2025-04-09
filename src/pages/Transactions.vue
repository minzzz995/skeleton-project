<script setup>
import { useTransactionStore } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';
import TransactionList from '@/components/Transaction/TransactionList.vue';
import TransactionModal from '@/components/Transaction/TransactionModal.vue';
</script>
<template>
  <h1>Transactions</h1>
</template>

<style scoped></style>
