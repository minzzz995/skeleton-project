<template>
  <div class="modal" id="addModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h4 class="modal-title">입력폼</h4>
        </div>

        <div class="modal-body">
          <form id="accountForm" @submit.prevent="onSubmit">
            <div class="mb-3">
              <label class="form-label d-block">유형</label>
              <div class="custom-radio-group">
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
                style="width: 100%"
              />
            </div>
            <div class="mb-3">
              <label for="category" class="form-label">분류</label>
              <select class="form-select" id="category" required>
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
              />
            </div>
            <div class="mb-3">
              <label for="memo" class="form-label">메모</label>
              <textarea
                class="form-control"
                id="memo"
                rows="2"
                placeholder="선택 사항"
              ></textarea>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-primary" form="accountForm">
            Submit
          </button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { onMounted, ref, computed } from 'vue';
import { formatMonth } from '../../utils/formatDate';
import * as api from '../../services/api';

// 날짜 값
const d = ref(new Date());
// 수입 or 지출 라디오 선택값
const selectedType = ref('income');

const incomeCategories = ref([]);
const expenseCategories = ref([]);

const categoryList = computed(() => {
  if (selectedType.value === 'income') return incomeCategories.value;
  if (selectedType.value === 'expense') return expenseCategories.value;
});

onMounted(async () => {
  try {
    const [income, expense] = await Promise.all([
      api.get('incomecategory'),
      api.get('expensecategory'),
    ]);

    incomeCategories.value = income;
    expenseCategories.value = expense;
  } catch (err) {
    console.log('카테고리 불러오기 실패!');
  }
});

const onSubmit = async () => {
  const form = document.getElementById('accountForm');

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
    const res = await api.post('budget', newEntry);
    alert('내역이 저장되었습니다!');
  } catch (err) {
    alert('저장 중 오류가 발생했습니다.');
  }
  // 모달 닫기
  const modalEl = document.getElementById('addModal');
  bootstrap.Modal.getInstance(modalEl)?.hide();

  // 폼 초기화 -> 안하면 폼 닫고 초기화 안 되어있다!
  form.reset();
  d.value = new Date();
  selectedType.value = 'income';
};
</script>
<style scoped>
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

.custom-radio input[type='radio'] {
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
input[type='radio']#expense:checked + label {
  background-color: #dc3545; /* Bootstrap 빨강 */
  color: white;
  border-color: #dc3545;
}

/* 선택된 버튼 스타일: 수입 - 파랑 */
input[type='radio']#income:checked + label {
  background-color: #0d6efd; /* Bootstrap 파랑 */
  color: white;
  border-color: #0d6efd;
}
</style>
