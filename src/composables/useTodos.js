import { ref, watchEffect, onUnmounted } from 'vue';
import { db } from '@/api/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, updateDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useAuth } from './useAuth';

export function useTodos(category) {
  const todos = ref([]);
  const loading = ref(true);
  const currentGroupId = ref(null);
  const { user } = useAuth();
  let unsubscribe = null;

  watchEffect(async () => {
    if (!user.value) {
      todos.value = [];
      return;
    }

    // 1. 先抓取 User Profile 裡的 currentGroupId
    try {
      const userDoc = await getDoc(doc(db, 'users', user.value.uid));
      if (userDoc.exists() && userDoc.data().currentGroupId) {
        currentGroupId.value = userDoc.data().currentGroupId;
      } else {
        currentGroupId.value = user.value.uid; // 預設私人
      }
    } catch (e) {
      currentGroupId.value = user.value.uid;
    }

    if (unsubscribe) unsubscribe();

    // 2. 根據 Group ID 查詢
    const q = query(
      collection(db, 'todos'),
      where('groupId', '==', currentGroupId.value),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );

    unsubscribe = onSnapshot(q, (snapshot) => {
      todos.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      loading.value = false;
    });
  });

  onUnmounted(() => { if (unsubscribe) unsubscribe(); });

  const addTodo = async (text) => {
    if (!text.trim()) return;
    await addDoc(collection(db, 'todos'), {
      text: text.trim(), isDone: false,
      category, // Number
      uid: user.value.uid,
      groupId: currentGroupId.value, // 寫入 Group ID
      createdAt: serverTimestamp()
    });
  };

  const toggleDone = async (item) => updateDoc(doc(db, 'todos', item.id), { isDone: !item.isDone });
  const removeTodo = async (id) => deleteDoc(doc(db, 'todos', id));

  return { todos, loading, addTodo, toggleDone, removeTodo };
}