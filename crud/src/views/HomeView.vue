<template>
  <v-container>
    <v-row>
      <v-col
        v-for="movie in movies"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MovieCard :movie="movie" @ver-detalhes="verDetalhes" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import MovieCard from "@/components/MovieCard.vue";

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
    console.log("Filmes carregados:", this.movies); //retirar pós teste
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
    login() {
      // Navegar para página de login (defina a rota no router)
      this.$router.push("/login");
    },
    verDetalhes(id) {
      // Navegar para a página de detalhes do filme
      this.$router.push(`/movie/${id}`);
    },
  },
};
</script>
