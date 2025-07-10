<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-6" width="400" elevation="6">
      <v-card-title class="text-center text-h6 font-weight-bold">Cadastrar</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            label="Usuário"
            v-model="form.username"
            :error-messages="fieldErrors.username"
            outlined dense class="mb-4"
          />
          <v-text-field
            label="Email"
            type="email"
            v-model="form.email"
            :error-messages="fieldErrors.email"
            outlined dense class="mb-4"
          />
          <v-text-field
            label="Senha"
            type="password"
            v-model="form.password"
            :error-messages="fieldErrors.password"
            outlined dense class="mb-4"
          />
          <v-text-field
            label="Confirmar Senha"
            type="password"
            v-model="form.confirmPassword"
            :error-messages="fieldErrors.confirmPassword"
            outlined dense class="mb-4"
          />
          <v-btn type="submit" color="indigo" block class="text-white">Cadastrar</v-btn>
          <div class="text-center mt-4">
            <p>Já possui conta? <RouterLink to="/login">Login</RouterLink></p>
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
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { firebaseApp } from '../firebase/firebase'

export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      fieldErrors: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
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
        email: '',
        password: '',
        confirmPassword: '',
      }

      // Username validation
      if (!this.form.username.trim()) {
        this.fieldErrors.username = 'Usuário é obrigatório'
        isValid = false
      }

      // Email validation
      if (!this.form.email.trim()) {
        this.fieldErrors.email = 'E-mail é obrigatório'
        isValid = false
      } else if (!/^\S+@\S+\.\S+$/.test(this.form.username)) {
        this.fieldErrors.username = 'E-mail inválido'
        isValid = false
      }

      // Password validation
      if (!this.form.password) {
        this.fieldErrors.password = 'Senha é obrigatória'
        isValid = false
      } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(this.form.password)) {
        this.fieldErrors.password = 'Senha fraca! Use 8+ caracteres com letras maiúsculas, minúsculas, números e símbolos.'
        isValid = false
      }

      // Confirm password validation
      if (!this.form.confirmPassword) {
        this.fieldErrors.confirmPassword = 'Confirmação de senha é obrigatória'
        isValid = false
      } else if (this.form.password !== this.form.confirmPassword) {
        this.fieldErrors.confirmPassword = 'As senhas não coincidem'
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

      const auth = getAuth(firebaseApp)
      try {
        await createUserWithEmailAndPassword(auth, this.form.email, this.form.password)
        this.showSnackbar('Usuário cadastrado com sucesso!', 'success')
        setTimeout(() => {
          this.$router.push('/login')
        }, 1500)
      } catch (error) {
        let errorMessage = 'Erro ao cadastrar usuário'        
        this.showSnackbar(errorMessage)
      }
    }
  }
}
</script>