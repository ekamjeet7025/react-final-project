import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyCw5I6XJpjhHalj8Wm-lD13U5bWgaBKdAs",
  authDomain: "study-dashboard-8cdee.firebaseapp.com",
  projectId: "study-dashboard-8cdee",
  storageBucket: "study-dashboard-8cdee.firebasestorage.app",
  messagingSenderId: "421717480011",
  appId: "1:421717480011:web:9c483280dd2564662e33ce"
};

const app = initializeApp(firebaseConfig);

// 🔥 EXPORT BOTH
export const auth = getAuth(app);
export const db = getFirestore(app); // 🔥 IMPORTANT