<template>
  <v-card>
    <v-card-text>
      <p class="subheading red--text">{{error}}</p>
      <p class="subheading primary--text">{{message}}</p>
      <v-form>
        <v-text-field
          label="E-mail"
          v-model="email"
          :rules="emailRules"
          required
        ></v-text-field>
        <v-btn block color="primary" dark @click="sendEmail()">Send Reset Email</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data: () => ({
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      email: '',
      error: '',
      message: ''
    }),
    methods: {
      sendEmail: async function () {
        this.error = ''
        if (this.email) {
          firebase.auth().sendPasswordResetEmail(this.email)
          this.message = 'Reset email has been send to your email.'
        }
      }
    }
  }
</script>
<style scoped>
</style>
