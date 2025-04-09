<template>
  <div class="container">
    <h1><i class="fa-solid fa-ban icon"></i>404 ERROR</h1>
    <h2>페이지를 찾을 수 없습니다.</h2>
    <br />
    <p>페이지가 존재하지 않거나 사용할 수 없는 페이지입니다.</p>
    <p>입력하신 주소가 정확한지 다시 한 번 확인해주세요.</p>
  </div>
</template>

<script setup></script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

h1 {
  font-size: 2em;
}

.icon {
  font-size: 1em;
  margin-right: 8px;
  color: #d9534f;
}
</style>
