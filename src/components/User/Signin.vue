<template>
  <v-dialog v-model="open">
    <v-card>
      <v-card-title>
        <p class="title">Sign In</p>
      </v-card-title>
      <v-card-text>
        <p class="subheading red--text">{{error}}</p>
        <v-form>
          <v-text-field
            label="E-mail"
            v-model="user.email"
            :rules="emailRules"
            required></v-text-field>
          <v-text-field
            label="E-mail"
            v-model="user.password"
            :type="'password'"
            required></v-text-field>
          <v-btn block color="primary" dark @click="signIn()">Sign In</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
  import firebase from 'firebase'
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
            this.open = false
          }
        })
      },
      changeModal: function (val) {
        this.open = val
      }
    }
  }
</script>
<style scoped>
</style>
