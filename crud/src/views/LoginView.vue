<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-6" width="400" elevation="6">
      <v-card-title class="text-center text-h6 font-weight-bold">LOGIN</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit(onSubmit)">
          <v-text-field
            label="Usuário (e-mail)"
            v-model="username"
            :error-messages="usernameTouched && usernameError ? [usernameError] : []"
            outlined dense autocomplete="off" class="mb-4"
            @blur="usernameBlur"
          />

          <v-text-field
            label="Senha"
            type="password"
            v-model="password"
            :error-messages="passwordTouched && passwordError ? [passwordError] : []"
            outlined dense autocomplete="new-password" class="mb-4"
            @blur="passwordBlur"
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
  </v-container>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseApp } from '../firebase/firebase'

import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

export default {
  name: 'LoginView',
  setup(_, { router }) {
    // Schema de validação com Yup
    const schema = yup.object({
      username: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
      password: yup.string().required('Senha é obrigatória'),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });

    // Campos e validação
    const {
      value: username,
      errorMessage: usernameError,
      meta: usernameMeta,
      handleBlur: usernameBlur
    } = useField('username');

    const {
      value: password,
      errorMessage: passwordError,
      meta: passwordMeta,
      handleBlur: passwordBlur
    } = useField('password');

    // Lógica de login
    const onSubmit = async (values) => {
      const auth = getAuth(firebaseApp);
      try {
        await signInWithEmailAndPassword(auth, values.username, values.password);
        router.push('/');
      } catch (error) {
        alert('Credenciais inválidas');
        console.log(error.message);
      }
    };

    return {
      handleSubmit,
      onSubmit,
      username,
      usernameError,
      usernameTouched: usernameMeta.touched,
      usernameBlur,
      password,
      passwordError,
      passwordTouched: passwordMeta.touched,
      passwordBlur,
    };
  }
}
</script>
