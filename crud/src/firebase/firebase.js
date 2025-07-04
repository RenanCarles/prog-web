import { initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyChzosh-nGrUkvLls6OV2-t-IvvDz_ixmM",
    authDomain: "trab-final-progweb.firebaseapp.com",
    projectId: "trab-final-progweb",
    storageBucket: "trab-final-progweb.firebasestorage.app",
    messagingSenderId: "685164976692",
    appId: "1:685164976692:web:ecab72ff3672f5b4134861",
    measurementId: "G-W9NS11BX9G"
}

export const firebaseApp = initializeApp(firebaseConfig)