import { ref } from 'vue';
import { auth } from '@/api/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const user = ref(null);
const isAuthReady = ref(false);

export function initAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (u) => {
      user.value = u;
      isAuthReady.value = true;
      resolve();
    });
  });
}

export function useAuth() {
  return { user, isAuthReady };
}