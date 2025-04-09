<template>
  <nav class="navbar navbar-light bg-sidebar px-3 d-md-none position-relative">
    <!-- 브랜드 -->
    <span class="navbar-brand fw-bold">폭싹 썼수다</span>

    <!-- 햄버거 + 드롭다운 메뉴 -->
    <div class="dropdown">
      <button
        class="no-border bg-sidebar p-2 rounded"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i class="fa-solid fa-bars"></i>
      </button>

      <ul
        class="dropdown-menu dropdown-menu-end bg-sidebar shadow"
        aria-labelledby="dropdownMenuButton"
      >
        <li v-for="item in items" :key="item.path">
          <router-link
            :to="item.path"
            class="dropdown-item d-flex align-items-center gap-2 no-hover"
            :class="{ 'bg-active': $route.path === item.path }"
          >
            <i :class="item.icon"></i>
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
const $route = useRoute();

const items = [
  { path: "/", label: "대시보드", icon: "fa-solid fa-house" },
  {
    path: "/transaction",
    label: "거래내역",
    icon: "fa-regular fa-money-bill-1",
  },
  { path: "/profile", label: "프로필", icon: "fa-regular fa-circle-user" },
];
</script>

<style scoped>
.bg-sidebar {
  background-color: #b3e5fc;
}

.bg-active {
  background-color: #8cdbff;
  border-radius: 6px;
}

.no-border {
  border: none;
  box-shadow: none;
}

.no-hover:hover {
  background-color: transparent !important;
  color: inherit !important;
}
</style>
