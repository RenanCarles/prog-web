import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCZ5BJ5f_kGPTd8L9Qsnc0BVt9-U469XLo",
  authDomain: "crud-filmes-dac79.firebaseapp.com",
  projectId: "crud-filmes-dac79",
  storageBucket: "crud-filmes-dac79.firebasestorage.app",
  messagingSenderId: "858786399849",
  appId: "1:858786399849:web:80c954597013b2ec5404f8",
};

export const firebaseApp = initializeApp(firebaseConfig);
