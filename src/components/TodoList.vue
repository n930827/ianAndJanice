<template>
  <div class="space-y-3">
    <div class="flex items-center space-x-3 mb-6 bg-white p-2 rounded-xl shadow-soft border border-wabi-100">
      <input v-model="newItem" @keyup.enter="handleAddItem" type="text" placeholder="Add item..." class="flex-1 bg-transparent px-3 py-2 outline-none text-wabi-900" />
      <button @click="handleAddItem" class="w-8 h-8 flex items-center justify-center bg-wabi-900 text-white rounded-lg">+</button>
    </div>

    <ul class="space-y-3">
      <li v-for="item in todos" :key="item.id" class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
        <div class="flex items-center space-x-4">
          <button @click="toggleDone(item)" class="w-5 h-5 rounded border flex items-center justify-center transition-colors" :class="item.isDone ? 'bg-wabi-400 border-wabi-400' : 'border-wabi-300'">
            <span v-if="item.isDone" class="text-white text-xs">✓</span>
          </button>
          <span class="text-wabi-700" :class="{ 'line-through text-wabi-300': item.isDone }">{{ item.text }}</span>
        </div>
        <button @click="removeTodo(item.id)" class="text-wabi-200 hover:text-red-400">✕</button>
      </li>
    </ul>
    <div v-if="todos.length === 0 && !loading" class="text-center py-12 text-wabi-300 text-sm">Nothing here yet.</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTodos } from '@/composables/useTodos';

const props = defineProps({ category: { type: Number, required: true } });
const { todos, loading, addTodo, toggleDone, removeTodo } = useTodos(props.category);
const newItem = ref('');

const handleAddItem = async () => {
  if (!newItem.value.trim()) return;
  await addTodo(newItem.value);
  newItem.value = '';
};
</script>