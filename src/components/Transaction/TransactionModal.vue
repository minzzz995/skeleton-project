<template>
  <div class="modal font-hakgyo" id="addModal" data-bs-backdrop="static">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-center">
          <h3 class="modal-title">입력폼</h3>
        </div>

        <div class="modal-body">
          <form id="accountForm" @submit.prevent="onSubmit">
            <div class="mb-3">
              <div class="custom-radio-group" @change="Reset">
                <div class="custom-radio">
                  <input
                    type="radio"
                    id="income"
                    name="type"
                    value="income"
                    v-model="selectedType"
                    required
                  />
                  <label for="income">수입</label>
                </div>
                <div class="custom-radio">
                  <input
                    type="radio"
                    id="expense"
                    name="type"
                    value="expense"
                    v-model="selectedType"
                  />
                  <label for="expense">지출</label>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">날짜</label>
              <VueDatePicker
                class="form-label"
                required
                locale="ko"
                v-model="d"
                :format="formatMonth"
                :clearable="false"
                style="width: 100%"
              />
            </div>
            <div class="mb-3">
              <label for="category" class="form-label">분류</label>
              <select
                class="form-select"
                id="category"
                required
                v-model="selectedCategory"
              >
                <option value="" selected disabled hidden>선택하세요</option>
                <option
                  v-for="category in categoryList"
                  :key="category.id"
                  :value="category.name"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="detailcategory" class="form-label">내역명</label>
              <input
                type="text"
                class="form-control"
                id="detailcategory"
                placeholder="예: 스타벅스"
                required
                v-model="detailCategory"
              />
            </div>
            <div class="mb-3">
              <label for="amount" class="form-label">금액</label>
              <input
                type="number"
                class="form-control"
                id="amount"
                placeholder="예: 5500"
                min="0"
                required
                v-model="amount"
              />
            </div>
            <div class="mb-3">
              <label for="memo" class="form-label">메모</label>
              <textarea
                class="form-control"
                id="memo"
                rows="2"
                placeholder="선택 사항"
                v-model="memo"
              ></textarea>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-blue" form="accountForm">
            Submit
          </button>
          <button
            type="button"
            class="btn btn-red"
            data-bs-dismiss="modal"
            @click="onClose"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useCategoryStore } from "@/store/categoryStore";
import { onMounted, ref, computed } from "vue";
import { formatMonth } from "../../utils/formatDate";
import * as api from "../../services/api";

const emit = defineEmits(["close", "added"]);
// 날짜 값
const d = ref(new Date());
// 수입 or 지출 라디오 선택값
const selectedType = ref("income");
const selectedCategory = ref("");
const detailCategory = ref("");
const amount = ref(0);
const memo = ref("");

const categoryStore = useCategoryStore();

const incomeCategories = computed(() => categoryStore.incomeCategories);
const expenseCategories = computed(() => categoryStore.expenseCategories);

onMounted(() => {
  const modalEl = document.getElementById("addModal");
  // 인스턴스가 이미 있다면 생성하지 않음
  if (!window.bootstrap.Modal.getInstance(modalEl)) {
    new window.bootstrap.Modal(modalEl);
  }
});

onMounted(async () => {
  await categoryStore.fetchCategories();
});

const onClose = () => {
  Reset();
  selectedType.value = "income";
  detailCategory.value = "";
  amount.value = "";
  memo.value = "";
};

const Reset = () => {
  d.value = new Date();
  selectedCategory.value = "";
};

const categoryList = computed(() => {
  if (selectedType.value === "income") return incomeCategories.value;
  if (selectedType.value === "expense") return expenseCategories.value;
});

const onSubmit = async () => {
  const form = document.getElementById("accountForm");

  const type = selectedType.value;
  const date = d.value;
  const category = form.category.value;
  const detailcategory = form.detailcategory.value;
  const amount = Number(form.amount.value);
  const memo = form.memo.value;

  const newEntry = {
    type,
    date,
    category,
    detailcategory,
    amount,
    memo,
  };

  console.log(newEntry);

  // 저장
  try {
    const res = await api.post("budget", newEntry);
    alert("내역이 저장되었습니다!");
    emit("added");
  } catch (err) {
    alert("저장 중 오류가 발생했습니다.");
  }
  // 모달 닫기
  const modalEl = document.getElementById("addModal");
  const modal =
    window.bootstrap.Modal.getInstance(modalEl) ||
    new window.bootstrap.Modal(modalEl);
  modal.hide();

  // 💥 백드롭 수동 제거
  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) backdrop.remove();

  // 💥 body 클래스 초기화 (스크롤 막힘 방지)
  document.body.classList.remove("modal-open");
  document.body.style = "";

  // 폼 초기화 -> 안하면 폼 닫고 초기화 안 되어있다!
  onClose();
};
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

.modal-header {
  border-bottom: none !important;
}
.modal-footer {
  border-top: none !important;
}

.custom-radio-group {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.custom-radio {
  position: relative;
  display: inline-block;
}

.custom-radio input[type="radio"] {
  display: none;
}

.custom-radio label {
  display: inline-block;
  padding: 10px 50px;
  border: 2px solid #eee;
  border-radius: 6px;
  cursor: pointer;
  color: black;
  transition: all 0.2s ease-in-out;
  user-select: none;
}

/* 선택된 버튼 스타일: 지출 - 빨강 */
input[type="radio"]#expense:checked + label {
  background-color: #e1bee7;
  color: white;
  border-color: #e1bee7;
}

/* 선택된 버튼 스타일: 수입 - 파랑 */
input[type="radio"]#income:checked + label {
  background-color: #c8e6c9;
  color: white;
  border-color: #c8e6c9;
}
</style>
