<template>
    <v-container class="fill-height d-flex justify-center align-center">
      <v-card class="pa-6" width="400" elevation="6">
        <v-card-title class="text-center text-h6 font-weight-bold">Cadastrar</v-card-title>
  
        <v-card-text>
          <v-form @submit.prevent="handleSubmit(onSubmit)">
            <v-text-field
              label="Usuário"
              v-model="values.username"
              :error-messages="errors.username"
              outlined dense class="mb-4"
            />
            <v-text-field
              label="Email"
              type="email"
              v-model="values.email"
              :error-messages="errors.email"
              outlined dense class="mb-4"
            />
            <v-text-field
              label="Senha"
              type="password"
              v-model="values.password"
              :error-messages="errors.password"
              outlined dense class="mb-4"
            />
            <v-text-field
              label="Confirmar Senha"
              type="password"
              v-model="values.confirmPassword"
              :error-messages="errors.confirmPassword"
              outlined dense class="mb-4"
            />
            <v-btn type="submit" color="indigo" block class="text-white">Cadastrar</v-btn>
            <div class="text-center mt-4">
              <p>Já possui conta? <RouterLink to="/login">Login</RouterLink></p>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
  import { firebaseApp } from '../firebase/firebase'
  
  import { useForm } from 'vee-validate'
  import * as yup from 'yup'
  
  export default {
    name: 'RegisterView',
    setup() {
      const schema = yup.object({
        username: yup.string().required('Usuário é obrigatório'),
        email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
        password: yup.string()
          .required('Senha é obrigatória')
          .matches(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
            'Senha fraca! Use 8+ caracteres com letras maiúsculas, minúsculas, números e símbolos.'
          ),
        confirmPassword: yup.string()
          .oneOf([yup.ref('password')], 'As senhas não coincidem')
          .required('Confirmação de senha é obrigatória'),
      });
  
      const { handleSubmit, errors, values } = useForm({
        validationSchema: schema,
        initialValues: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        }
      });
  
      const onSubmit = async (values) => {
        const auth = getAuth(firebaseApp);
        try {
          await createUserWithEmailAndPassword(auth, values.email, values.password);
          alert('Usuário cadastrado com sucesso!');
          window.location.href = '/login'; // ou use this.$router.push
        } catch (error) {
          alert(error.message);
          console.error(error.message);
        }
      };
  
      return {
        values,
        errors,
        handleSubmit,
        onSubmit,
      }
    }
  }
  </script>
  