<template>
  <v-card class="pa-3 mt-3">
    <v-card-title>
      Change Email
    </v-card-title>

    <v-layout row wrap>

      <v-flex xs12>
        <p class="subheading red--text">{{error}}</p>
      </v-flex>

      <v-flex xs12>
        <v-text-field label="Email address" v-model="email"
        ></v-text-field>
      </v-flex>

      <v-flex xs12>
        <v-btn block color="primary" @click="changeEmail()">
          Update email
        </v-btn>
      </v-flex>

    </v-layout>

    <v-snackbar
      :timeout="6000"
      color="success"
      v-model="snackbar"
    >
      Successfully updated your Profile
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
  import firebase from 'firebase'
  import StringUtils from '../../../utils/StringUtils'
  export default {
    data: () => ({
      loading: false,
      snackbar: false,
      email: '',
      error: ''
    }),
    methods: {
      async changeEmail () {
        let user = firebase.auth().currentUser
        if (this.email && StringUtils.isEmail(this.email)) {
          this.loading = true
          user.updateEmail(this.email).then().catch(error => { this.error = error.message })
          this.loading = false
          this.snackbar = true
        } else {
          this.error = 'Invalid email'
        }
      }
    }
  }
</script>

<style>

</style>
