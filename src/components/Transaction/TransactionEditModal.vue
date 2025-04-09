<template>
  <div class="modal font-hakgyo" id="modifyModal" data-bs-backdrop="static">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-center">
          <h4 class="modal-title">수정폼</h4>
        </div>

        <div class="modal-body">
          <form id="modifyForm" @submit.prevent="onSubmit">
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
          <button type="submit" class="btn btn-blue" form="modifyForm">
            Modify
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
import { onMounted, ref, watch, computed } from "vue";
import { formatMonth } from "../../utils/formatDate";
import * as api from "../../services/api";

// selectedBudget 받아옴
const props = defineProps({
  selectedBudget: {
    type: Object,
    required: false,
    default: null,
  },
});

const emit = defineEmits(["updated", "close"]);

// 날짜 값
const d = ref(new Date());
// 수입 or 지출 라디오 선택값
const selectedType = ref("income");
const selectedCategory = ref("");
const detailCategory = ref("");
const amount = ref(0);
const memo = ref("");

// selectedBudget 값 변경될 때마다 폼 초기화
watch(
  () => props.selectedBudget,
  (newVal) => {
    if (newVal) {
      d.value = new Date(newVal.date);
      selectedType.value = newVal.type;
      selectedCategory.value = newVal.category;
      detailCategory.value = newVal.detailcategory;
      amount.value = newVal.amount;
      memo.value = newVal.memo || "";
    }
  },
  { immediate: true }
);

const categoryStore = useCategoryStore();

const incomeCategories = computed(() => categoryStore.incomeCategories);
const expenseCategories = computed(() => categoryStore.expenseCategories);

onMounted(async () => {
  await categoryStore.fetchCategories();

  if (props.selectedBudget) {
    selectedType.value = props.selectedBudget.type;
    d.value = new Date(props.selectedBudget.date);
    selectedCategory.value = props.selectedBudget.category;
    detailCategory.value = props.selectedBudget.detailcategory;
    amount.value = props.selectedBudget.amount;
    memo.value = props.selectedBudget.memo;
  }
});

const categoryList = computed(() => {
  if (selectedType.value === "income") return incomeCategories.value;
  if (selectedType.value === "expense") return expenseCategories.value;
});

const onSubmit = async () => {
  const updatedBudget = {
    ...props.selectedBudget,
    type: selectedType.value,
    date: d.value,
    category: selectedCategory.value,
    detailcategory: detailCategory.value,
    amount: Number(amount.value),
    memo: memo.value,
  };
  console.log("🛠 updatedBudget", updatedBudget);

  try {
    emit("updated", updatedBudget);
    alert("수정되었습니다!");
  } catch (err) {
    alert("수정 중 오류가 발생했습니다.");
  }

  bootstrap.Modal.getInstance(document.getElementById("modifyModal"))?.hide();
  emit("close");
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
