<template>
  <div class="d-flex flex-column bg-info text-white p-3" style="width: 200px; min-height: 100vh;">
    <h5 class="mb-4 fw-bold">폭싹 썼수다</h5>
    <ul class="nav nav-pills flex-column">
      <li class="nav-item" @click="$emit('navigate', 'dashboard')">
        <a :class="['nav-link', current === 'dashboard' ? 'active' : 'text-white']">📊 대시보드</a>
      </li>
      <li class="nav-item" @click="$emit('navigate', 'transactions')">
        <a :class="['nav-link', current === 'transactions' ? 'active' : 'text-white']">📑 거래내역</a>
      </li>
      <li class="nav-item" @click="$emit('navigate', 'profile')">
        <a :class="['nav-link', current === 'profile' ? 'active' : 'text-white']">👤 프로필</a>
      </li>
    </ul>
    <div class="mt-auto pt-4 d-flex align-items-center gap-2">
      <img src=\"/assets/profile.png\" alt=\"profile\" class=\"rounded-circle\" width=\"32\" height=\"32\" />
      <span>정성훈</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ current: String })
</script>
