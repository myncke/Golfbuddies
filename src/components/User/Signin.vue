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

        <v-btn block color="primary" dark @click="signIn()">Sign In</v-btn>
        <br>
        <hr class="divider">
        <br>
        <v-btn block color="blue darken-4" dark @click="signInWithFacebook()">Facebook</v-btn>
        <v-btn block color="grey lighten-2" @click="signInWithGoogle()">Google</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  import firebase from 'firebase'
  import LoginUtils from '../../utils/LoginUtils'

  export default {
    data: () => ({
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      user: {email: '', password: ''},
      open: false,
      error: ''
    }),
    methods: {
      signIn: async function () {
        this.error = ''
        firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password).catch(_ => {
          this.error = 'Invalid username or password'
        }).then(() => {
          if (this.error === '') {
            this.$store.dispatch('signUserIn', this.user)
          }
        })
      },
      signInWithFacebook: async function () {
        let filledModel = await LoginUtils.logInWithFacebook(error => { this.error = error.message })
        if (filledModel !== undefined && filledModel.nickname === undefined) {
          this.$router.push({name: 'landing', query: {page: 2, model: filledModel}})
        }
      },
      signInWithGoogle: async function () {
        let filledModel = await LoginUtils.logInWithGoogle(error => { this.error = error.message })
        if (filledModel !== undefined && filledModel.nickname === undefined) {
          this.$router.push({name: 'landing', query: {page: 2, model: filledModel}})
        }
      }
    }
  }
</script>
<style scoped>
</style>
