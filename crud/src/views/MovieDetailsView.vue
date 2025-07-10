<template>
  <div v-if="movie">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-img 
            :src="getPosterUrl(movie.poster_path)" 
            height="auto"
            :aspect-ratio="2/3"
            contain
            class="rounded-lg poster-img"
          ></v-img>
        </v-col>
        <v-col cols="12" md="8">
          <v-card elevation="3" class="pa-4">
            <v-card-title class="text-h4 mb-2">{{ movie.title }}</v-card-title>
            <v-card-subtitle class="text-subtitle-1 mb-4">
              Data de lançamento: {{ formatDate(movie.release_date) }}
            </v-card-subtitle>

            <v-divider class="mb-4"></v-divider>

            <v-card-text>
              <div class="text-h6 mb-2">Sinopse</div>
              <p class="text-body-1">{{ movie.overview }}</p>
            </v-card-text>

            <v-divider class="my-4"></v-divider>

            <!-- Avaliações do filme -->
            <v-card-text>
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="text-h6">Avaliações</div>
                <div v-if="averageRating">
                  <v-rating
                    :model-value="averageRating / 2"
                    color="amber"
                    density="compact"
                    half-increments
                    readonly
                    size="small"
                  ></v-rating>
                  <span class="text-subtitle-2 ml-2">Nota média: {{ averageRating.toFixed(1) }} ({{ feedbacks.length }} avaliações)</span>
                </div>
              </div>

              <!-- Formulário para adicionar avaliação -->
              <v-card variant="outlined" class="mb-4 pa-3">
                <v-form @submit.prevent="submitFeedback">
                  <div class="text-subtitle-1 mb-2">Adicionar sua avaliação</div>
                  <v-textarea
                    v-model="newFeedback.comentario"
                    label="Seu comentário"
                    variant="outlined"
                    rows="3"
                    hide-details
                    class="mb-3"
                  ></v-textarea>
                  <div class="d-flex align-center mb-3">
                    <span class="mr-2">Sua nota:</span>
                      <v-text-field
                        v-model="newFeedback.nota"
                        type="number"
                        min="0"
                        max="5"
                        step="1"
                        hide-details
                        style="max-width: 75px;"
                      ></v-text-field>
                  </div>
                  <v-btn type="submit" color="primary" block>Enviar avaliação</v-btn>
                </v-form>
              </v-card>

              <!-- Lista de avaliações -->
              <div v-if="feedbacks.length">
                <v-card
                  v-for="feedback in feedbacks"
                  :key="feedback.id"
                  variant="outlined"
                  class="mb-3 pa-3"
                >
                  <div class="d-flex justify-space-between align-center mb-2">
                    <v-rating
                      :model-value="feedback.nota / 2"
                      color="amber"
                      density="compact"
                      readonly
                      size="small"
                    ></v-rating>
                    <div class="d-flex align-center">
                      <span class="text-caption me-4">{{ formatDate(feedback.created_at) }}</span>
                      <span class="text-caption me-4">Nota: {{ feedback.nota }}/10</span>
                    </div>
                  </div>
                  <p class="text-body-2 mb-2">{{ feedback.comentario }}</p>
                  <div class="d-flex justify-end">
                    <v-btn color="primary" variant="outlined" class="me-2" prepend-icon="mdi-pencil" @click="startEdit(feedback)">
                      Editar
                    </v-btn>
                    <v-btn color="error" variant="outlined" prepend-icon="mdi-delete" @click="confirmDelete(feedback.id)">
                      Excluir
                    </v-btn>
                  </div>
                </v-card>
              </div>
              <div v-else class="text-center my-4 text-subtitle-1">
                Nenhuma avaliação disponível. Seja o primeiro a avaliar!
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div v-else class="d-flex justify-center align-center" style="height: 400px">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>

  <!-- Diálogo de edição -->
  <v-dialog v-model="editDialog" max-width="500px" persistent>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Editar avaliação</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="cancelEdit">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-5">
        <v-textarea
          v-model="editingFeedback.comentario"
          label="Seu comentário"
          variant="outlined"
          rows="3"
          hide-details
          class="mb-4"
        ></v-textarea>
        <div class="d-flex align-center mb-3">
          <span class="mr-3 font-weight-medium">Sua nota:</span>
          <v-text-field
            v-model="editingFeedback.nota"
            type="number"
            min="0"
            max="5"
            step="1"
            hide-details
            style="max-width: 100px;"
            variant="outlined"
            density="compact"
          ></v-text-field>
          <span class="ml-2"></span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="outlined" @click="cancelEdit" class="mr-2">Cancelar</v-btn>
        <v-btn color="primary" variant="elevated" @click="updateFeedback">Salvar alterações</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo de confirmação de exclusão -->
  <v-dialog v-model="deleteDialog" max-width="400px" persistent>
    <v-card>
      <v-toolbar color="error" dark>
        <v-toolbar-title>Confirmar exclusão</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pt-4">
        <p class="text-body-1">Tem certeza que deseja excluir esta avaliação?</p>
        <p class="text-body-2 font-italic mt-2">Esta ação não pode ser desfeita.</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="outlined" @click="deleteDialog = false" class="mr-2">Cancelar</v-btn>
        <v-btn color="error" variant="elevated" @click="deleteFeedback">Excluir avaliação</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "MovieDetailsView",
  data() {
    return {
      movie: null,
      feedbacks: [],
      averageRating: 0,
      newFeedback: {
        comentario: "",
        nota: 0,
      },
      editDialog: false,
      deleteDialog: false,
      editingFeedback: {
        id: null,
        comentario: "",
        nota: 0
      },
      feedbackToDelete: null
    };
  },
  mounted() {
    this.fetchMovieDetails();
    this.fetchFeedbacks();
  },
  methods: {
    async fetchMovieDetails() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/movies/${this.$route.params.id}`
        );
        if (response.data && response.data.length > 0) {
          this.movie = response.data[0];
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      }
    },
    async fetchFeedbacks() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/feedback/movie/${this.$route.params.id}`
        );
        this.feedbacks = response.data;
        
        // Calcular média de avaliações
        if (this.feedbacks.length > 0) {
          const sum = this.feedbacks.reduce((total, feedback) => total + feedback.nota, 0);
          this.averageRating = sum / this.feedbacks.length;
        }
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
      }
    },
    async submitFeedback() {
      try {
        if (!this.newFeedback.comentario || this.newFeedback.nota === 0) {
          alert("Por favor, preencha o comentário e a nota");
          return;
        }
        
        const feedback = {
          id_filme: parseInt(this.$route.params.id),
          comentario: this.newFeedback.comentario,
          nota: this.newFeedback.nota,
        };
        
        await axios.post("http://localhost:3000/api/feedback", feedback);
        
        // Limpar formulário e atualizar avaliações
        this.newFeedback = { comentario: "", nota: 0 };
        this.fetchFeedbacks();
      } catch (error) {
        console.error("Erro ao enviar avaliação:", error);
      }
    },
    getPosterUrl(path) {
      return `https://image.tmdb.org/t/p/w500${path}`;
    },

    startEdit(feedback) {
      this.editingFeedback = { ...feedback };
      this.editDialog = true;
    },

    cancelEdit() {
      this.editingFeedback = { id: null, comentario: "", nota: 0 };
      this.editDialog = false;
    },
    // Método para atualizar a avaliação
    async updateFeedback() {
      try {
        if (!this.editingFeedback.comentario || !this.editingFeedback.nota) {
          alert("Por favor, preencha o comentário e a nota");
          return;
        }
        
        await axios.put(
          `http://localhost:3000/api/feedback/${this.editingFeedback.id}`,
          {
            comentario: this.editingFeedback.comentario,
            nota: parseFloat(this.editingFeedback.nota)
          }
        );
        
        this.editDialog = false;
        this.fetchFeedbacks();
      } catch (error) {
        console.error("Erro ao atualizar avaliação:", error);
      }
    },
    // Método para confirmar a exclusão
    confirmDelete(id) {
      this.feedbackToDelete = id;
      this.deleteDialog = true;
    },
    // Método para excluir a avaliação
    async deleteFeedback() {
      try {
        await axios.delete(`http://localhost:3000/api/feedback/${this.feedbackToDelete}`);
        this.deleteDialog = false;
        this.feedbackToDelete = null;
        this.fetchFeedbacks();
      } catch (error) {
        console.error("Erro ao excluir avaliação:", error);
      }
    },
formatDate(dateInput) {
  if (!dateInput) return "Data não disponível";

  let date;

  // Caso seja Timestamp serializado do Firebase
  if (typeof dateInput === "object" && dateInput._seconds) {
    date = new Date(dateInput._seconds * 1000);
  }
  // Caso seja uma string no formato "YYYY-MM-DD"
  else if (typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    date = new Date(dateInput + "T00:00:00");
  }
  // Caso seja Date ou outro formato reconhecível
  else {
    date = new Date(dateInput);
  }

  // Verifica se a data é válida
  if (isNaN(date.getTime())) {
    return "Data inválida";
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("pt-BR", options);
}


  },
};
</script>


<style scoped>
.poster-img {
  background-color: #f0f0f0;
  margin: 0 auto;
}
</style>