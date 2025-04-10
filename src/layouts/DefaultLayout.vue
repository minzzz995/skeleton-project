<template>
  <div class="layout-wrapper d-flex flex-column flex-md-row">
    <!-- 모바일용 NavBar -->
    <Navbar class="d-md-none" />

    <!-- 태블릿 이상용 SideBar -->
    <div class="sidebar-wrapper d-none d-md-block">
      <SideBar />
    </div>

    <!-- 메인 콘텐츠 -->
    <main class="main-content-wrapper flex-fill font-hakgyo">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import SideBar from '@/components/Sidebar.vue';
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  overflow-x: hidden;
}

.sidebar-wrapper {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

.main-content-wrapper {
  min-height: 100vh;
  overflow-y: auto;
  padding-left: 0;
  padding-top: 40px;
}

@media (min-width: 768px) {
  .main-content-wrapper {
    margin-left: 250px;
  }
}
</style>
