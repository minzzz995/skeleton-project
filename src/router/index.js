import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Transactions from '@/pages/Transactions.vue';
import Profile from '@/pages/Profile.vue';
import ProfileEdit from '@/pages/ProfileEdit.vue';
import NotFound from '@/pages/NotFound.vue';
import Calendar from '@/pages/Calendar.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/transaction', component: Transactions },
    { path: '/calendar', component: Calendar },
    { path: '/profile', component: Profile },
    { path: '/profile/edit', component: ProfileEdit },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.path !== from.path) {
      // 페이지가 실제로 바뀌는 경우에만 스크롤 맨 위로 이동
      return { top: 0 };
    }
    // 같은 페이지 내 동작일 경우 스크롤 유지
    return false;
  },
});

export default router;
