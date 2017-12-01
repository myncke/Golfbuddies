<template>
  <v-card>
    <v-card-text>
      <p class="subheading red--text">{{error}}</p>
      <v-form>
        <v-text-field
          label="E-mail"
          v-model="user.email"
          :rules="emailRules"
          required
        ></v-text-field>

        <v-text-field
          label="Password"
          v-model="user.password"
          :type="'password'"
          required
        ></v-text-field>

        <v-btn block color="primary" :loading="loading" dark @click="signIn()">Sign In</v-btn>
        <br>
        <hr class="divider">
        <br>
        <v-btn block color="blue darken-4" dark @click="signInWithFacebook()">Facebook</v-btn>
        <v-btn block dark color="red " @click="signInWithGoogle()">Google</v-btn>
        <br>
        <hr class="divider">
        <br>
        <v-expansion-panel class="elevation-0">
          <v-expansion-panel-content >
            <div slot="header">Forgot your password?</div>
            <v-card>
              <forgot-password></forgot-password>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  import firebase from 'firebase'
  import LoginUtils from '../../utils/LoginUtils'
  import ForgotPassword from '../Static/ForgotPassword.vue'

  export default {
    data: () => ({
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      user: {email: '', password: ''},
      open: false,
      error: '',
      loading: false
    }),
    methods: {
      signIn: async function () {
        this.loading = true
        this.error = ''
        firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password).catch(_ => {
          this.error = 'Invalid username or password'
          this.loading = false
        }).then(() => {
          if (this.error === '') {
            this.$store.dispatch('signUserIn', this.user)
            this.loading = false
          }
        })
      },
      signInWithFacebook: async function () {
        let filledModel = await LoginUtils.logInWithFacebook(error => { this.error = error })
        if (filledModel !== undefined && !filledModel.homeclub) {
          this.$emit('social-user', filledModel)
        }
      },
      signInWithGoogle: async function () {
        let filledModel = await LoginUtils.logInWithGoogle(error => { this.error = error })
        if (filledModel !== undefined && !filledModel.homeclub) {
          this.$emit('social-user', filledModel)
        }
      }
    },
    components: {
      'forgot-password': ForgotPassword
    }
  }
</script>
<style scoped>
</style>
