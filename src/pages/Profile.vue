<template>
  <div class="font-dahaeng">
    <apexchart type="bar" height="200" />
    <div class="flex-grow-1 p-4 bg-light">
      <div class="profile-page">
        <!-- 사용자 정보 -->
        <h2 class="section-title">나의 정보</h2>
        <section class="user-info" v-if="userStore.name">
          <div class="profile-info">
            <img
              :src="userStore.profileImage || 'https://via.placeholder.com/40'"
              alt="프로필 사진"
            />
            <div class="text-info">
              <p class="username">{{ userStore.name || "닉네임 없음" }}</p>
              <p class="tel">
                연락처 : {{ userStore.phone || "000-0000-0000" }}
              </p>
            </div>
          </div>
          <div class="btn-wrapper">
            <router-link to="/profile/edit" class="edit-btn">
              회원 정보 수정
            </router-link>
          </div>
        </section>
        <section v-else>
          <p>로딩 중입니다...</p>
        </section>

        <!-- 소비 패턴 분석 -->
        <section class="spending-analysis">
          <h2>나의 소비 패턴 분석</h2>
          <!-- 카테고리별 지출 원형 그래프 -->
          <div class="chart-graph">
            <CategoryChart />
          </div>
          <!-- 절약/과소비 분석 카드, type별로 2개 보여줌. -->
          <div class="comparison-cards">
            <TopCategoryCard type="saved" />
            <TopCategoryCard type="overspent" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store/userStore";
import CategoryChart from "@/components/Profile/CategoryChart.vue";
import TopCategoryCard from "@/components/Profile/TopCategoryCard.vue";

const userStore = useUserStore();
const user = ref({});

onMounted(async () => {
  await userStore.fetchUserInfo();
});
</script>
<style scoped>
.profile-page {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.user-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 0.75rem;
  padding: 1rem 0;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.text-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1.5rem;
}

.username {
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
  margin: 0;
}

.tel {
  font-size: 0.95rem;
  color: #000;
  margin-top: 0.25rem;
}

.btn-wrapper {
  display: flex;
  justify-content: center;
}

.edit-btn {
  display: inline-block;
  padding: 6px 12px;
  background-color: #b3e5fc;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  text-decoration: none;
  color: #292929;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 👈 그림자 추가 */
}

.edit-btn:hover {
  background-color: #8cdbff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 👈 그림자 추가 */
}

.spending-analysis {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.chart-graph {
  margin-top: 1.5rem;
}

.comparison-cards {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.comparison-cards > * {
  flex: 1 1 48%;
}

@media (max-width: 768px) {
  .comparison-cards {
    flex-direction: column;
  }
  .comparison-cards > * {
    width: 100%;
  }
}
</style>
