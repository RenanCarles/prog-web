import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "../firebase/firebase";

const auth = getAuth(firebaseApp);

// Componentes importados diretamente (para rotas principais)
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";

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
    name: "home",
    component: HomeView,
    meta: { requiresAuth: false }, // Rota privada //SÓ para teste
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false }, // Rota pública explícita
  },
  {
    path: "/register",
    name: "register", // Padronizei para lowercase como as outras rotas
    component: RegisterView,
    meta: { requiresAuth: false }, // Rota pública
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    meta: { requiresAuth: true }, // Rota privada
  },
  // Adicione outras rotas conforme necessário
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
