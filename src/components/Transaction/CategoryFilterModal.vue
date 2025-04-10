<template>
  <div
    class="modal font-hakgyo d-block"
    tabindex="-1"
    style="background: rgba(0, 0, 0, 0.4)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-center">
          <h2 class="modal-title" style="font-size: x-large">카테고리 선택</h2>
        </div>

        <div class="modal-body d-flex flex-column align-items-center">
          <!-- 수입 -->
          <div class="type-label income-label">수입</div>
          <div class="category-list mb-4">
            <div
              v-for="c in incomeCategories"
              :key="'income-' + c.id"
              class="category-item"
              :class="{ selected: isSelected('income', c.name) }"
              @click="toggleCategory('income', c.name)"
            >
              {{ c.name }}
            </div>
          </div>

          <!-- 지출 -->
          <div class="type-label expense-label">지출</div>
          <div class="category-list">
            <div
              v-for="c in expenseCategories"
              :key="'expense-' + c.id"
              class="category-item"
              :class="{ selected: isSelected('expense', c.name) }"
              @click="toggleCategory('expense', c.name)"
            >
              {{ c.name }}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-blue" @click="confirm">적용</button>
          <button class="btn btn-red" @click="cancel">초기화</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCategoryStore } from "@/store/categoryStore";

const emit = defineEmits(["selected"]);

const selectedCategories = ref([]); // 다중 선택
const categoryStore = useCategoryStore();
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

onMounted(() => {
  categoryStore.fetchCategories();
  selectedCategories.value = [...props.modelValue.map((c) => ({ ...c }))];
});
const incomeCategories = computed(() => categoryStore.incomeCategories);
const expenseCategories = computed(() => categoryStore.expenseCategories);

function toggleCategory(type, name) {
  const key = `${type}-${name}`;
  const index = selectedCategories.value.findIndex(
    (c) => `${c.type}-${c.name}` === key
  );
  if (index === -1) {
    selectedCategories.value.push({ type, name });
  } else {
    selectedCategories.value.splice(index, 1);
  }
}

function confirm() {
  emit("selected", selectedCategories.value); // 배열로 넘김
}

function cancel() {
  emit("selected", []); // 초기화
}
function isSelected(type, name) {
  return selectedCategories.value.some(
    (c) => c.type === type && c.name === name
  );
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
  background-color: #e04848;
  color: white;
}
.btn-blue:hover {
  background-color: #3ba1c7;
  color: white;
}

.modal-header {
  border-bottom: none !important;
}
.modal-footer {
  border-top: none !important;
}

.type-label {
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.income-label {
  background-color: rgb(200, 230, 201);
  color: black;
}
.expense-label {
  background-color: rgb(217, 196, 230);
  color: black;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f0f8ff;
  border-radius: 12px;
  width: 100%;
  max-width: 90%;
}

.category-item {
  background: white;
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  font-family: "Hakgyo", sans-serif;
  cursor: pointer;
  transition: 0.2s ease;
}
.category-item:hover {
  background-color: #cce7ff;
}
.category-item.selected {
  background-color: #b3e5fc;
  font-weight: bold;
}
</style>
