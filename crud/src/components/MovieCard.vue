<template>
  <v-card class="ma-4" max-width="300" elevation="4">
    <v-img :src="getPosterUrl(movie.poster_path)" height="400" cover></v-img>

    <v-card-title class="text-wrap">{{ movie.title }}</v-card-title>

    <v-card-subtitle>
      Nota: {{ movie.vote_average ? movie.vote_average.toFixed(1) : "N/A" }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn color="primary" @click="$emit('ver-detalhes', movie.id)">
        Ver Detalhes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "MovieCard",
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getPosterUrl(path) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    },
  },
};
</script>

<style scoped>
.v-card-title {
  font-size: 1rem;
  min-height: 56px;
}
</style>
