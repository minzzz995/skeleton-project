<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "./layouts/DefaultLayout.vue";
</script>

<style>
body {
  margin: 0;
  font-family: "Noto Sans KR", sans-serif;
}
</style>
