<template>
  <nav
    class="navbar navbar-light bg-sidebar px-3 d-md-none position-relative font-hakgyo"
  >
    <!-- 브랜드 -->
    <router-link to="/" class="text-decoration-none text-dark">
      <span
        class="navbar-brand fw-bold"
        style="font-family: 'NanumDahaeng', sans-serif"
        >폭싹 썼수다</span
      >
    </router-link>

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
import { onMounted } from "vue";
import { useRoute } from "vue-router";
const $route = useRoute();

const items = [
  { path: "/", label: "대시보드", icon: "fa-solid fa-house" },
  {
    path: "/transaction",
    label: "거래내역",
    icon: "fa-regular fa-money-bill-1",
  },
  { path: "/calendar", label: "캘린더", icon: "fa-regular fa-calendar" },
  { path: "/profile", label: "프로필", icon: "fa-regular fa-circle-user" },
];

onMounted(() => {
  const toggleButton = document.querySelector('[data-bs-toggle="dropdown"]');
  if (toggleButton) {
    // 드롭다운 인스턴스 생성
    const dropdown = new window.bootstrap.Dropdown(toggleButton);

    // 클릭 이벤트에 드롭다운 토글 연결 (이게 핵심!)
    toggleButton.addEventListener("click", (e) => {
      e.preventDefault(); // 기본 동작 방지
      dropdown.toggle(); // 수동으로 토글
    });
  }
});
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
