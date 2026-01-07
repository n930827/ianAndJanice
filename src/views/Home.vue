<template>
  <div class="flex flex-col h-screen overflow-hidden bg-wabi-50">
    <header class="p-6 flex justify-between items-center bg-wabi-50/90 backdrop-blur z-10">
      <h2 class="text-xl font-medium text-wabi-900">{{ CATEGORY_NAME[activeTab] }}</h2>
      <button @click="logout" class="text-sm text-wabi-500">Logout</button>
    </header>

    <main class="flex-1 overflow-y-auto px-4 pb-24 scrollbar-hide">
      <TodoList :category="activeTab" :key="activeTab" />
    </main>

    <nav class="fixed bottom-0 w-full bg-white border-t border-wabi-200 safe-pb flex justify-around items-center h-[80px] z-20 shadow-soft">
      <button 
        v-for="tab in TABS_CONFIG" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors"
        :class="activeTab === tab.id ? 'text-wabi-900' : 'text-wabi-300'"
      >
        <component :is="icons[tab.iconName]" class="w-6 h-6" />
        <span class="text-[10px] font-bold uppercase tracking-widest">{{ tab.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signOut } from 'firebase/auth';
import { auth } from '@/api/firebase';
import { useRouter } from 'vue-router';
import TodoList from '@/components/TodoList.vue';
import { CATEGORY_TYPE, CATEGORY_NAME, TABS_CONFIG } from '@/constants/enum';
import { ListBulletIcon, CakeIcon } from '@heroicons/vue/24/outline';

const icons = { ListBulletIcon, CakeIcon };
const router = useRouter();
const activeTab = ref(CATEGORY_TYPE.TODO);

const logout = async () => {
  await signOut(auth);
  router.push('/login');
};
</script>

