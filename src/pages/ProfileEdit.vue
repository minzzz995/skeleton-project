<template>
  <div class="d-flex vh-100">
    <main class="flex-grow-1">
      <div class="mx-auto px-3" style="max-width: 900px">
        <h1 class="fs-3" style="margin: 2rem 0">회원 정보 수정</h1>
      </div>
      <form
        @submit.prevent="handleSubmit"
        class="mx-auto px-3"
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
            <p class="text-danger small mb-4">
              ※ 회원 정보 수정을 위해 비밀번호를 다시 입력해주세요.
            </p>
            <div class="input-group">
              <input
                id="password"
                :type="showPw ? 'text' : 'password'"
                class="form-control"
                v-model="form.password"
                @input="validatePassword(form.password)"
              />
              <span
                class="input-group-text"
                @click="showPw = !showPw"
                style="cursor: pointer"
              >
                <i class="fa" :class="showPw ? 'fa-eye-slash' : 'fa-eye'"></i>
              </span>
            </div>
            <ul class="password-checklist mt-2">
              <li :class="checkClass(passwordConditions.length)">
                {{ getIcon(passwordConditions.length) }} 8자 이상
              </li>
              <li :class="checkClass(passwordConditions.upper)">
                {{ getIcon(passwordConditions.upper) }} 대문자 포함
              </li>
              <li :class="checkClass(passwordConditions.lower)">
                {{ getIcon(passwordConditions.lower) }} 소문자 포함
              </li>
              <li :class="checkClass(passwordConditions.digit)">
                {{ getIcon(passwordConditions.digit) }} 숫자 포함
              </li>
              <li :class="checkClass(passwordConditions.special)">
                {{ getIcon(passwordConditions.special) }} 특수문자 포함
              </li>
            </ul>
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
            <div class="input-group">
              <input
                id="passwordConfirm"
                :type="showPwConfirm ? 'text' : 'password'"
                class="form-control"
                v-model="form.passwordConfirm"
              />
              <span
                class="input-group-text"
                @click="showPwConfirm = !showPwConfirm"
                style="cursor: pointer"
              >
                <i
                  class="fa"
                  :class="showPwConfirm ? 'fa-eye-slash' : 'fa-eye'"
                ></i>
              </span>
            </div>
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
          style="margin-top: 2rem"
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";

const showPw = ref(false);
const showPwConfirm = ref(false);
const passwordValid = ref(false);

const passwordConditions = ref({
  length: false,
  upper: false,
  lower: false,
  digit: false,
  special: false,
});

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  id: "",
  name: "",
  password: "",
  passwordConfirm: "",
  phone1: "",
  phone2: "",
  phone3: "",
  profileImage: null,
});

onMounted(async () => {
  try {
    await userStore.fetchUserInfo();
    form.value.name = userStore.name || "";
    form.value.id = userStore.id || "";
    form.value.password = "";
    form.value.passwordConfirm = "";
    const [p1, p2, p3] = (userStore.phone || "").split("-");
    form.value.phone1 = p1 || "";
    form.value.phone2 = p2 || "";
    form.value.phone3 = p3 || "";
    form.value.profileImage = userStore.profileImage || predefinedImages[0];

    validatePassword(form.value.password);
  } catch (e) {
    alert("사용자 정보를 불러오는 데 실패했습니다.");
  }
});

function onlyNumber(field) {
  form.value[field] = form.value[field].replace(/\D/g, "");
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    alert("이름을 입력해주세요.");
    return;
  }
  if (
    !/^\d{3}$/.test(form.value.phone1) ||
    !/^\d{4}$/.test(form.value.phone2) ||
    !/^\d{4}$/.test(form.value.phone3)
  ) {
    alert("올바른 휴대전화 번호를 입력해주세요.");
    return;
  }
  // 👉 비밀번호 미입력 체크
  if (!form.value.password || !form.value.passwordConfirm) {
    alert("비밀번호를 입력해주세요.");
    return;
  }

  // 👉 형식 검사
  if (!passwordValid.value) {
    alert("비밀번호 형식을 확인해주세요.");
    return;
  }

  // 👉 일치 여부 확인
  if (form.value.password !== form.value.passwordConfirm) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const original = {
    name: userStore.name,
    password: userStore.password,
    phone: userStore.phone,
    profileImage: userStore.profileImage,
  };
  const changed = {
    name: form.value.name,
    password: form.value.password,
    phone: `${form.value.phone1}-${form.value.phone2}-${form.value.phone3}`,
    profileImage: form.value.profileImage,
  };
  if (JSON.stringify(original) === JSON.stringify(changed)) {
    alert("변경된 내용이 없습니다.");
    return;
  }

  try {
    await userStore.updateUserInfo(form.value);
    alert("수정 완료!");
    router.push("/profile");
  } catch (e) {
    alert("수정 실패");
  }
}

// 미리보기 이미지 리스트
const predefinedImages = [
  new URL("/image/profile1.png", import.meta.url).href,
  new URL("/image/profile2.png", import.meta.url).href,
  new URL("/image/profile3.png", import.meta.url).href,
  new URL("/image/profile4.png", import.meta.url).href,
];

// 이미지 선택 핸들러
function selectProfileImage(imageUrl) {
  form.value.profileImage = imageUrl;
}

function normalize(url) {
  if (!url) return "";
  return url.split("/").slice(-2).join("/"); // "image/profile1.png"처럼 비교
}

function validatePassword(password) {
  passwordConditions.value.length = password.length >= 8;
  passwordConditions.value.upper = /[A-Z]/.test(password);
  passwordConditions.value.lower = /[a-z]/.test(password);
  passwordConditions.value.digit = /[0-9]/.test(password);
  passwordConditions.value.special = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
    password
  );

  // 최종 유효 여부
  passwordValid.value = Object.values(passwordConditions.value).every((v) => v);
}
function checkClass(valid) {
  return valid ? "pass" : "fail";
}

function getIcon(valid) {
  return valid ? "✅" : "❌";
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
.password-checklist {
  font-size: 0.9rem;
  color: #888;
  padding-left: 1rem;
  list-style: none;
  margin: 0;
}
.password-checklist li {
  margin-bottom: 0.2rem;
}
.password-checklist li.pass {
  color: green;
  font-weight: bold;
}
.password-checklist li {
  margin-bottom: 0.2rem;
  font-weight: bold;
}
</style>
