<template>
  <div class="d-flex vh-100">
    <main class="flex-grow-1 overflow-auto">
      <div class="mx-auto w-75" style="max-width: 900px">
        <h1 style="margin-top: 5rem">회원 정보 수정</h1>
      </div>
      <form
        @submit.prevent="handleSubmit"
        class="mx-auto w-75"
        style="max-width: 900px"
      >
        <hr />
        <!-- 이름 -->
        <div class="row align-items-center mb-3">
          <div class="col-3">
            <label for="name" class="form-label mb-0">이름</label>
          </div>
          <div class="col-9">
            <input
              id="name"
              type="text"
              class="form-control"
              v-model="form.name"
            />
          </div>
        </div>
        <hr />
        <!-- 비밀번호 -->
        <div class="row align-items-center mb-3">
          <div class="col-3">
            <label for="password" class="form-label mb-0">비밀번호</label>
          </div>
          <div class="col-9">
            <input
              id="password"
              type="password"
              class="form-control"
              v-model="form.password"
            />
          </div>
        </div>
        <hr />
        <!-- 비밀번호 확인 -->
        <div class="row align-items-center mb-3">
          <div class="col-3">
            <label for="passwordConfirm" class="form-label mb-0"
              >비밀번호 확인</label
            >
          </div>
          <div class="col-9">
            <input
              id="passwordConfirm"
              type="password"
              class="form-control"
              v-model="form.passwordConfirm"
            />
          </div>
        </div>
        <hr />
        <!-- 연락처 -->
        <div class="row align-items-center mb-3">
          <div class="col-3">
            <label class="form-label mb-0">휴대전화</label>
          </div>
          <div class="col-9">
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
        </div>
        <hr />
        <!-- 프로필 사진 선택 (미리보기 아이콘 형태) -->
        <div class="row align-items-start mb-3">
          <div class="col-3">
            <label class="form-label mb-0">프로필 이미지 선택</label>
          </div>
          <div class="col-9">
            <div class="d-flex gap-3 flex-wrap">
              <img
                v-for="(img, index) in predefinedImages"
                :key="index"
                :src="img"
                alt="프로필 이미지"
                @click="selectProfileImage(img)"
                class="rounded-circle border"
                :class="{
                  'border-primary border-3':
                    normalize(form.profileImage) === normalize(img),
                }"
                style="
                  width: 80px;
                  height: 80px;
                  cursor: pointer;
                  object-fit: cover;
                "
              />
            </div>
          </div>
        </div>
        <hr />
        <div
          class="d-flex justify-content-center gap-3"
          style="margin-top: 4rem"
        >
          <button type="submit" class="btn btn-blue">수정하기</button>
          <button @click.prevent="router.push('/profile')" class="btn btn-red">
            뒤로가기
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

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  id: '',
  name: '',
  password: '',
  passwordConfirm: '',
  phone1: '',
  phone2: '',
  phone3: '',
  profileImage: null,
});

onMounted(async () => {
  try {
    await userStore.fetchUserInfo();
    form.value.name = userStore.name || '';
    form.value.id = userStore.id || '';
    form.value.password = userStore.password || '';
    form.value.passwordConfirm = userStore.password || '';
    const [p1, p2, p3] = (userStore.phone || '').split('-');
    form.value.phone1 = p1 || '';
    form.value.phone2 = p2 || '';
    form.value.phone3 = p3 || '';
    form.value.profileImage = userStore.profileImage || predefinedImages[0];
  } catch (e) {
    alert('사용자 정보를 불러오는 데 실패했습니다.');
  }
});

function onlyNumber(field) {
  form.value[field] = form.value[field].replace(/\D/g, '');
}

async function handleSubmit() {
  if (form.value.password !== form.value.passwordConfirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    await userStore.updateUserInfo(form.value); // 👈 store에게 맡김
    alert('수정 완료!');
    router.push('/profile');
  } catch (e) {
    alert('수정 실패');
  }
}

// 미리보기 이미지 리스트
const predefinedImages = [
  new URL('/image/profile1.png', import.meta.url).href,
  new URL('/image/profile2.png', import.meta.url).href,
  new URL('/image/profile3.png', import.meta.url).href,
  new URL('/image/profile4.png', import.meta.url).href,
];

// 이미지 선택 핸들러
function selectProfileImage(imageUrl) {
  form.value.profileImage = imageUrl;
}

function normalize(url) {
  if (!url) return '';
  return url.split('/').slice(-2).join('/'); // "image/profile1.png"처럼 비교
}
</script>

<style scoped>
.btn-red {
  background-color: #ff5c5c;
  color: white;
}
.btn-blue {
  background-color: #50b4d8;
  color: white;
}
.btn-red:hover {
  background-color: #e04848; /* 기존보다 어두운 붉은색 */
  color: white;
}

.btn-blue:hover {
  background-color: #3ba1c7; /* 기존보다 어두운 푸른색 */
  color: white;
}
</style>
