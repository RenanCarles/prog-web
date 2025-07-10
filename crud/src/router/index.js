import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "../firebase/firebase";

const auth = getAuth(firebaseApp);

import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import MovieDetailsView from "@/views/MovieDetailsView.vue";

// Função do guardião de rota
const authGuard = (to, from, next) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Usuário autenticado, permite acesso
      next();
    } else {
      // Usuário não autenticado, redireciona para login com o caminho original como query
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    }
  });
};

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true }, 
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false }, 
  },
  {
    path: "/register",
    name: "register", 
    component: RegisterView,
    meta: { requiresAuth: false }, 
  },
  {
    path: "/movie/:id",
    name: "movie-details",
    component: MovieDetailsView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Interceptador global de navegação
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth) {
    authGuard(to, from, next);
  } else {
    next(); // Continuar normalmente para rotas públicas
  }
});

export default router;
