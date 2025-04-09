<template>
  <div class="d-flex flex-column flex-md-row h-100">
    <!-- 모바일용 NavBar -->
    <Navbar class="d-md-none" />

    <!-- 태블릿 이상용 SideBar -->
    <SideBar class="d-none d-md-block" />

    <!-- 메인 콘텐츠 -->

    <main class="flex-fill font-hakgyo" style="overflow: hidden">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import SideBar from "@/components/Sidebar.vue";
</script>

<style scoped>
/* 필요 시 추가 스타일 */
</style>
