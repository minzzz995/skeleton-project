<template>
  <div
    class="d-none d-md-flex flex-column justify-content-between bg-sidebar text-dark"
    style="width: 250px; height: 100%"
  >
    <!-- 상단 앱 제목 + 로고 -->
    <div>
      <router-link
        to="/"
        class="text-decoration-none text-dark d-flex align-items-center justify-content-between px-3 pt-3"
        style="gap: 8px"
      >
        <h5
          class="mb-0 fw-bold fs-3"
          style="font-family: 'NanumDahaeng', sans-serif"
        >
          폭싹 썼수다
        </h5>
      </router-link>

      <ul class="list-unstyled px-3 font-hakgyo mt-4">
        <li class="mb-3">
          <router-link
            to="/"
            class="text-decoration-none text-dark d-flex align-items-center gap-2"
            :class="{ 'bg-active': $route.path === '/' }"
          >
            <i class="fa-solid fa-house"></i>
            <span>대시보드</span>
          </router-link>
        </li>

        <li class="mb-3">
          <router-link
            to="/transaction"
            class="text-decoration-none text-dark d-flex align-items-center gap-2"
            :class="{ 'bg-active': $route.path === '/transaction' }"
          >
            <i class="fa-regular fa-money-bill-1"></i>
            <span>거래내역</span>
          </router-link>
        </li>

        <li class="mb-3">
          <router-link
            to="/calendar"
            class="text-decoration-none text-dark d-flex align-items-center gap-2"
            :class="{ 'bg-active': $route.path === '/calendar' }"
          >
            <i class="fa-regular fa-calendar"></i>
            <span>캘린더</span>
          </router-link>
        </li>

        <li class="mb-3">
          <router-link
            to="/profile"
            class="text-decoration-none text-dark d-flex align-items-center gap-2"
            :class="{ 'bg-active': $route.path === '/profile' }"
          >
            <i class="fa-regular fa-circle-user"></i>
            <span>프로필</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 하단 프로필 -->
    <div class="d-flex align-items-center p-3 font-hakgyo">
      <img
        :src="userStore.profileImage || '/assets/profile_default.png'"
        alt="프로필"
        class="rounded-circle"
        style="width: 40px; height: 40px; object-fit: cover"
      />
      <div class="ms-2">{{ userStore.name || 'Guest' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as api from '../services/api';
import { useUserStore } from '@/store/userStore';
import defaultProfile from '@/assets/profile_default.png';

const userStore = useUserStore();
const user = ref();

onMounted(async () => {
  try {
    const res = await api.get('user');
    user.value = res[0];
  } catch (err) {
    console.error('사용자 정보를 불러오지 못했습니다.');
  }
});
</script>
<style scope>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
ul li > a {
  padding: 8px 12px;
  border-radius: 8px;
  display: block;
  transition: background-color 0.2s ease-in-out;
}
.bg-active {
  background-color: #8cdbff;
}

.bg-sidebar {
  background-color: #b3e5fc;
}
</style>
