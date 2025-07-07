<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-6" width="400" elevation="6">
      <v-card-title class="text-center text-h6 font-weight-bold">LOGIN</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            label="E-mail"
            v-model="form.username"
            :error-messages="fieldErrors.username"
            outlined dense autocomplete="off" class="mb-4"
            @blur="() => touched.username = true"
          />

          <v-text-field
            label="Senha"
            type="password"
            v-model="form.password"
            :error-messages="fieldErrors.password"
            outlined dense autocomplete="new-password" class="mb-4"
            @blur="() => touched.password = true"
          />

          <v-btn type="submit" color="indigo" block class="text-white">Login</v-btn>

          <div class="text-center mt-4">
            <p>
              Ainda não possui conta?
              <RouterLink to="/register">Cadastre-se</RouterLink>
            </p>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseApp } from '../firebase/firebase'

export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      touched: {
        username: false,
        password: false,
      },
      fieldErrors: {
        username: '',
        password: '',
      },
      snackbar: {
        show: false,
        message: '',
        color: 'error'
      }
    }
  },
  methods: {
    validateForm() {
      let isValid = true
      
      // Reset errors
      this.fieldErrors = {
        username: '',
        password: '',
      }

      // Email validation
      if (!this.form.username.trim()) {
        this.fieldErrors.username = 'E-mail é obrigatório'
        isValid = false
      } else if (!/^\S+@\S+\.\S+$/.test(this.form.username)) {
        this.fieldErrors.username = 'E-mail inválido'
        isValid = false
      }

      // Password validation
      if (!this.form.password) {
        this.fieldErrors.password = 'Senha é obrigatória'
        isValid = false
      }

      return isValid
    },
    
    showSnackbar(message, color = 'error') {
      this.snackbar.message = message
      this.snackbar.color = color
      this.snackbar.show = true
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        this.showSnackbar('Por favor, corrija os erros no formulário')
        return
      }

      try {
        const auth = getAuth(firebaseApp)
        await signInWithEmailAndPassword(auth, this.form.username, this.form.password)
        this.$router.push('/')
      } catch (error) {
        let errorMessage = 'Erro ao fazer login'
        
        // Tratamento de erros comuns do Firebase
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'E-mail inválido'
            break
          case 'auth/user-disabled':
            errorMessage = 'Esta conta está desativada'
            break
          case 'auth/user-not-found':
            errorMessage = 'Usuário não encontrado'
            break
          case 'auth/wrong-password':
            errorMessage = 'Senha incorreta'
            break
          default:
            console.error(error)
        }
        
        this.showSnackbar(errorMessage)
      }
    }
  }
}
</script>