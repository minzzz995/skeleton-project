<template>
  <div class="layout-container">
    <aside class="sidebar">
      <h2>사이드바</h2>
      <div>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </div>
    </aside>
    <main class="main-content">
      <h1>회원 정보 수정</h1>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="name" class="form-label">이름</label>
          <input
            id="name"
            type="text"
            class="form-control"
            v-model="form.name"
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">비밀번호</label>
          <input
            id="password"
            type="password"
            class="form-control"
            v-model="form.password"
          />
        </div>

        <div class="mb-3">
          <label for="passwordConfirm" class="form-label">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            type="password"
            class="form-control"
            v-model="form.passwordConfirm"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">연락처</label>
          <div class="d-flex gap-2">
            <input
              class="form-control"
              v-model="form.phone1"
              maxlength="3"
              @input="onlyNumber('phone1')"
            />
            <span class="align-self-center">-</span>
            <input
              class="form-control"
              v-model="form.phone2"
              maxlength="4"
              @input="onlyNumber('phone2')"
            />
            <span class="align-self-center">-</span>
            <input
              class="form-control"
              v-model="form.phone3"
              maxlength="4"
              @input="onlyNumber('phone3')"
            />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">프로필 사진 첨부</label>
          <input type="file" class="form-control" @change="handleFileChange" />

          <img
            v-if="form.profileImage"
            :src="URL.createObjectURL(form.profileImage)"
            alt="미리보기"
            style="max-width: 200px; margin-top: 10px"
          />
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary">수정하기</button>
          <button @click.prevent="handleDelete" class="btn btn-danger">
            삭제하기
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { updateUserInfo, deleteUserAccount } from '@/services/api';
import Sidebar from '@/components/Sidebar.vue';

const router = useRouter();
const userStore = useUserStore();

function handleNavigate(tab) {
  const routeMap = {
    dashboard: '/dashboard',
    transactions: '/transaction',
    profile: '/profile',
  };
  router.push(routeMap[tab]);
}

const form = ref({
  name: '',
  username: '',
  password: '',
  passwordConfirm: '',
  phone1: '',
  phone2: '',
  phone3: '',
  profileImage: null,
});

const fileName = ref('');

onMounted(() => {
  form.value.name = userStore.name;
  form.value.username = userStore.username;
  const [p1, p2, p3] = userStore.phone?.split('-') || ['', '', ''];
  form.value.phone1 = p1;
  form.value.phone2 = p2;
  form.value.phone3 = p3;
});

function onlyNumber(field) {
  form.value[field] = form.value[field].replace(/\D/g, '');
}

function handleFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    form.value.profileImage = file;
    fileName.value = file.name;
  }
}

async function handleSubmit() {
  if (form.value.password !== form.value.passwordConfirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  const payload = new FormData();
  payload.append('name', form.value.name);
  payload.append(
    'phone',
    `${form.value.phone1}-${form.value.phone2}-${form.value.phone3}`
  );
  if (form.value.password) payload.append('password', form.value.password);
  if (form.value.profileImage) {
    payload.append('profileImage', form.value.profileImage);
    payload.append('imgpath', form.value.profileImage.name);
  }

  try {
    await updateUserInfo(payload);
    userStore.setUser({
      name: form.value.name,
      username: form.value.username,
      password: form.value.password,
      phone: `${form.value.phone1}-${form.value.phone2}-${form.value.phone3}`,
      imgpath: form.value.imgpath,
    });
    alert('수정 완료!');
    router.push('/profile');
  } catch (e) {
    alert('수정 실패');
  }
}

async function handleDelete() {
  const confirmDelete = confirm('정말로 계정을 삭제하시겠습니까?');
  if (!confirmDelete) return;

  try {
    await deleteUserAccount();
    userStore.clearUser();
    router.push('/');
  } catch (e) {
    alert('삭제 실패');
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  flex: 1;
  background-color: #f4f4f4;
  padding: 20px;
  border-right: 1px solid #ccc;
}

.main-content {
  flex: 9;
  background-color: #fff;
  padding: 20px;
}
</style>
