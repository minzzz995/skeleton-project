<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog-custom">
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

            <div class="modal-footer d-flex justify-content-between">
              <button type="submit" class="btn btn-primary">Submit</button>
              <button
                type="button"
                class="btn btn-danger"
                @click="$emit('close')"
              >
                Close
              </button>
            </div>
          </form>
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

const d = ref(new Date());
const selectedType = ref('income');

const incomeCategories = ref([]);
const expenseCategories = ref([]);

const categoryList = computed(() => {
  return selectedType.value === 'income'
    ? incomeCategories.value
    : expenseCategories.value;
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
    console.error('카테고리 불러오기 실패:', err);
  }
});

const onSubmit = async () => {
  const form = document.getElementById('accountForm');

  const newEntry = {
    type: selectedType.value,
    date: d.value,
    category: form.category.value,
    detailcategory: form.detailcategory.value,
    amount: Number(form.amount.value),
    memo: form.memo.value,
  };

  try {
    await api.post('budget', newEntry);
    alert('내역이 저장되었습니다!');
    form.reset();
    d.value = new Date();
    selectedType.value = 'income';
    // 모달 닫기
    emit('close');
  } catch (err) {
    alert('저장 실패!');
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog-custom {
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
}

.modal-header,
.modal-footer {
  border: none;
}

.custom-radio-group {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.custom-radio input[type='radio'] {
  display: none;
}

.custom-radio label {
  padding: 10px 50px;
  border: 2px solid #eee;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
}

input[type='radio']#expense:checked + label {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

input[type='radio']#income:checked + label {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}
</style>
