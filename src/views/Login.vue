<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-wabi-50">
    <h1 class="text-3xl font-light text-wabi-900 mb-8">Wabi List</h1>
    <form @submit.prevent="handleLogin" class="w-full max-w-sm space-y-4">
      <input v-model="email" type="email" placeholder="Email" class="w-full p-4 bg-wabi-100 rounded-lg outline-none" required />
      <input v-model="password" type="password" placeholder="Password" class="w-full p-4 bg-wabi-100 rounded-lg outline-none" required />
      
      <div class="relative">
        <input v-model="groupCode" type="text" placeholder="Group Code (Optional)" class="w-full p-4 bg-wabi-100 rounded-lg border-2 border-transparent focus:border-wabi-300 outline-none" />
        <p class="text-xs text-wabi-500 mt-1 ml-1">*輸入相同的代碼即可共用清單</p>
      </div>

      <button type="submit" :disabled="loading" class="w-full py-4 bg-wabi-900 text-white rounded-lg shadow-soft hover:bg-black transition-colors">
        {{ loading ? 'Loading...' : 'Login / Join' }}
      </button>
      <p v-if="errorMsg" class="text-red-400 text-center text-sm">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/api/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const groupCode = ref('');
const loading = ref(false);
const errorMsg = ref('');
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    
    // 設定 Group ID
    const targetGroupId = groupCode.value.trim() || user.uid;
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      currentGroupId: targetGroupId,
      lastLogin: new Date()
    }, { merge: true });

    router.push('/');
  } catch (e) {
    errorMsg.value = '登入失敗: ' + e.message;
  } finally {
    loading.value = false;
  }
};
</script>