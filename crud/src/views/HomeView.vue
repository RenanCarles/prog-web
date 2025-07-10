<template>
  <div>
    <!-- Cabeçalho personalizado -->
    <div class="custom-header">
      <h1 class="app-title">UNIFEIFLIX</h1>
      <button class="logout-btn" @click="logout">
        <v-icon class="logout-icon">mdi-logout</v-icon>
        <span class="tooltip">Sair da conta</span>
      </button>
    </div>

    <!-- Conteúdo principal -->
    <v-container style="margin-top: 80px;">
      <v-row>
        <v-col
          v-for="movie in movies"
          :key="movie.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <MovieCard :movie="movie" />
        </v-col>
      </v-row>
    </v-container>
  </div>

</template>

<script>
import axios from "axios";
import MovieCard from "@/components/MovieCard.vue";
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "../firebase/firebase"; // Certifique-se de que o caminho está correto

export default {
  name: "HomeView",
  components: {
    MovieCard,
  },
  data() {
    return {
      movies: [],
    };
  },
  mounted() {
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      try {
        const res = await axios.get("http://localhost:3000/api/movies");
        this.movies = res.data;
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
    },

    async logout() {
      const auth = getAuth(firebaseApp);
      try {
        await signOut(auth);
        // Redireciona para login e limpa o histórico de navegação
        this.$router.replace({ 
          path: '/login',
          query: { logout: 'true' } // Opcional: para mostrar mensagem de logout
        });
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        alert("Ocorreu um erro ao tentar sair. Por favor, tente novamente.");
      }
    }

  },
};
</script>

<style scoped>
.custom-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: #270082; /* Cor primary do Vuetify */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.app-title {
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
}

.logout-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  position: relative;
  padding: 8px;
  display: flex;
  align-items: center;
}

.logout-btn:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.tooltip {
  visibility: hidden;
  width: 100px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: -40px;
  right: 0;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.8rem;
}

.logout-icon {
  font-size: 28px;
}
</style>