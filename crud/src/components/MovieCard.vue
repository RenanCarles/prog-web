<template>
  <v-card class="ma-4 movie-card" max-width="300" elevation="4">
    <!-- Badge de nota -->
    <div class="rating-badge">
      <span class="rating-value">
        {{ averageRating ? averageRating.toFixed(1) : "N/A" }}
      </span>
    </div>

    <v-img :src="getPosterUrl(movie.poster_path)" height="400" cover class="movie-poster">
      <template v-slot:placeholder>
        <div class="poster-placeholder"></div>
      </template>
    </v-img>

    <v-card-title class="text-wrap movie-title">{{ movie.title }}</v-card-title>

    <v-card-actions class="justify-center">
      <v-btn 
        color="indigo-darken-3" 
        variant="flat"
        @click="viewDetails(movie.id)"
        class="details-btn"
      >
        Ver Detalhes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  name: "MovieCard",
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      feedbacks: [],
      averageRating: null
    };
  },
  created() {
    this.fetchFeedbacks();
  },
  methods: {
    getPosterUrl(path) {
      return path 
        ? `https://image.tmdb.org/t/p/w500${path}`
        : 'https://via.placeholder.com/300x450?text=Poster+Indisponível';
    },
    viewDetails(id) {
      this.$router.push(`/movie/${id}`);
    },
    async fetchFeedbacks() {
      try {
        const response = await axios.get(`http://localhost:3000/api/feedback/movie/${this.movie.id}`);
        this.feedbacks = response.data;
        
        // Calcular média de avaliações baseada no campo "nota" dos feedbacks
        if (this.feedbacks.length > 0) {
          const sum = this.feedbacks.reduce((total, feedback) => total + feedback.nota, 0);
          this.averageRating = sum / this.feedbacks.length;
        } else {
          // Se não houver avaliações, usar o valor padrão do TMDB (se disponível)
          this.averageRating = this.movie.vote_average || null;
        }
      } catch (error) {
        // Se ocorrer erro na busca de avaliações, usar o valor padrão do TMDB
        console.error("Erro ao buscar avaliações:", error);
        this.averageRating = this.movie.vote_average || null;
      }
    }
  },
};
</script>

<style scoped>
/* Mantenha todos os estilos anteriores */
.movie-card {
  position: relative;
  transition: transform 0.3s ease;
  border-radius: 8px !important;
  overflow: hidden;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
}

.rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #ffd700 0%, #ffcc00 100%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  border: 2px solid #fff;
}

.rating-value {
  color: #000;
  font-weight: 700;
  font-size: 1rem;
  text-shadow: 0 1px 1px rgba(255,255,255,0.5);
}

.movie-poster {
  transition: all 0.3s ease;
}

.movie-card:hover .movie-poster {
  filter: brightness(1.05);
}

.movie-title {
  font-size: 1.1rem;
  font-weight: 600;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12px !important;
  background: #f5f5f5;
}

.v-card-actions {
  padding: 16px !important;
  background: #f5f5f5;
}

.details-btn {
  letter-spacing: normal;
  text-transform: none;
  font-weight: 500;
  border-radius: 20px;
  padding: 0 24px !important;
  height: 36px;
}

.poster-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 200%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>