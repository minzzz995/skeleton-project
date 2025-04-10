<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "./layouts/DefaultLayout.vue";
import { onMounted } from "vue";
import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchUserInfo("test"); // 앱 로딩 시 유저 정보 로드
});
</script>
