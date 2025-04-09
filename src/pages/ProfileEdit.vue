<template>
  <div class="d-flex vh-100">
    <Sidebar :current="'dashboard'" />

    <main class="flex-grow-1 p-4 bg-light overflow-auto">
      <h1 style="margin-bottom: 5rem">회원 정보 수정</h1>

      <form @submit.prevent="handleSubmit">
        <!-- 이름 -->
        <div class="row align-items-center mb-3">
          <div class="col-2">
            <label for="name" class="form-label mb-0">이름</label>
          </div>
          <div class="col-10">
            <input
              id="name"
              type="text"
              class="form-control"
              v-model="form.name"
            />
          </div>
        </div>

        <!-- 비밀번호 -->
        <div class="row align-items-center mb-3">
          <div class="col-2">
            <label for="password" class="form-label mb-0">비밀번호</label>
          </div>
          <div class="col-10">
            <input
              id="password"
              type="password"
              class="form-control"
              v-model="form.password"
            />
          </div>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="row align-items-center mb-3">
          <div class="col-2">
            <label for="passwordConfirm" class="form-label mb-0"
              >비밀번호 확인</label
            >
          </div>
          <div class="col-10">
            <input
              id="passwordConfirm"
              type="password"
              class="form-control"
              v-model="form.passwordConfirm"
            />
          </div>
        </div>

        <!-- 연락처 -->
        <div class="row align-items-center mb-3">
          <div class="col-2">
            <label class="form-label mb-0">연락처</label>
          </div>
          <div class="col-10">
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

        <!-- 프로필 사진 선택 (미리보기 아이콘 형태) -->
        <div class="row align-items-start mb-3">
          <div class="col-2">
            <label class="form-label mb-0">프로필 이미지 선택</label>
          </div>
          <div class="col-10">
            <div class="d-flex gap-3 flex-wrap">
              <img
                v-for="(img, index) in predefinedImages"
                :key="index"
                :src="img"
                alt="프로필 이미지"
                @click="selectProfileImage(img)"
                class="rounded-circle border"
                :class="{
                  'border-primary border-3': form.profileImage === img,
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";
import { updateUserInfo, deleteUserAccount } from "@/services/api";
import Sidebar from "@/components/Sidebar.vue";

const router = useRouter();
const userStore = useUserStore();

function handleNavigate(tab) {
  const routeMap = {
    dashboard: "/dashboard",
    transactions: "/transaction",
    profile: "/profile",
  };
  router.push(routeMap[tab]);
}

const form = ref({
  name: "",
  username: "",
  password: "",
  passwordConfirm: "",
  phone1: "",
  phone2: "",
  phone3: "",
  profileImage: null,
});

const fileName = ref("");

onMounted(() => {
  form.value.name = userStore.name;
  form.value.username = userStore.username;
  const [p1, p2, p3] = userStore.phone?.split("-") || ["", "", ""];
  form.value.phone1 = p1;
  form.value.phone2 = p2;
  form.value.phone3 = p3;

  form.value.profileImage = userStore.imgpath || "";
});

function onlyNumber(field) {
  form.value[field] = form.value[field].replace(/\D/g, "");
}
async function handleSubmit() {
  if (form.value.password !== form.value.passwordConfirm) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const payload = new FormData();
  payload.append("name", form.value.name);
  payload.append(
    "phone",
    `${form.value.phone1}-${form.value.phone2}-${form.value.phone3}`
  );
  if (form.value.password) payload.append("password", form.value.password);

  payload.append("imgpath", form.value.profileImage || "");

  try {
    await updateUserInfo(payload);
    userStore.setUser({
      name: form.value.name,
      username: form.value.username,
      password: form.value.password,
      phone: `${form.value.phone1}-${form.value.phone2}-${form.value.phone3}`,
      imgpath: form.value.imgpath,
    });
    alert("수정 완료!");
    router.push("/profile");
  } catch (e) {
    alert("수정 실패");
  }
}

async function handleDelete() {
  const confirmDelete = confirm("정말로 계정을 삭제하시겠습니까?");
  if (!confirmDelete) return;

  try {
    await deleteUserAccount();
    userStore.clearUser();
    router.push("/");
  } catch (e) {
    alert("삭제 실패");
  }
}

// 미리보기 이미지 리스트
const predefinedImages = [
  new URL("@/assets/profile1.png", import.meta.url).href,
  new URL("@/assets/profile2.png", import.meta.url).href,
  new URL("@/assets/profile3.png", import.meta.url).href,
  new URL("@/assets/profile4.png", import.meta.url).href,
];

// 이미지 선택 핸들러
function selectProfileImage(imageUrl) {
  form.value.profileImage = imageUrl;
  fileName.value = ""; // 기존 파일 업로드 이름 초기화
}
</script>
