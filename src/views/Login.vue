<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-wabi-50">
    <h1 class="text-3xl font-light text-wabi-900 mb-8">Wabi List</h1>
    <form @submit.prevent="handleLogin" class="w-full max-w-sm space-y-4">
      <input v-model="email" type="email" autocomplete="username" placeholder="Email" class="w-full p-4 bg-wabi-100 rounded-lg outline-none" required />
      <input v-model="password" type="password" autocomplete="current-password" placeholder="Password" class="w-full p-4 bg-wabi-100 rounded-lg outline-none" required />
      
      <div class="relative">
        <input v-model="groupCode" type="text"  placeholder="Group Code (Optional)" class="w-full p-4 bg-wabi-100 rounded-lg border-2 border-transparent focus:border-wabi-300 outline-none" />
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
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth'; // 記得引入 createUser
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
  console.log("1. 按鈕點擊，開始執行");
  loading.value = true;
  errorMsg.value = '';
  
  let userCredential;

  try {
    // A. 嘗試登入
    try {
      console.log("2. 嘗試登入中...");
      userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      console.log("3. 登入成功！");
    } catch (loginError) {
      // B. 如果登入失敗，檢查是不是因為「帳號不存在」
      // (注意：Firebase 新版安全策略有時會回傳 invalid-credential，所以我們兩個都試)
      if (loginError.code === 'auth/user-not-found' || loginError.code === 'auth/invalid-credential') {
        console.log("4. 帳號不存在，改為嘗試「註冊」...");
        userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        console.log("5. 註冊成功！");
      } else {
        // 如果是密碼錯誤或其他問題，就直接拋出錯誤
        throw loginError;
      }
    }

    // --- 到了這裡，代表已經拿到 user 了 ---
    const user = userCredential.user;
    console.log("6. 取得 User ID:", user.uid);
    
    // 設定 Group ID
    const targetGroupId = groupCode.value.trim() || user.uid;

    console.log("7. 準備寫入 Firestore (如果卡在這裡，就是被廣告阻擋器擋住了)");
    
    // 寫入資料庫
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      currentGroupId: targetGroupId,
      lastLogin: new Date()
    }, { merge: true });

    console.log("8. 寫入成功，準備跳轉");
    router.push('/');
    
  } catch (e) {
    console.error("發生錯誤:", e);
    // 顯示中文錯誤訊息
    if (e.code === 'auth/wrong-password') {
      errorMsg.value = '密碼錯誤';
    } else if (e.code === 'auth/weak-password') {
      errorMsg.value = '密碼太弱 (至少 6 位數)';
    } else if (e.code === 'auth/email-already-in-use') {
      errorMsg.value = '此 Email 已被註冊，請檢查密碼';
    } else {
      errorMsg.value = '登入失敗: ' + e.message;
    }
  } finally {
    loading.value = false;
  }
};
</script>