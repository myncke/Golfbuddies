<template>
  <v-card>
      <p class="title red--text">{{error}}</p>
      <v-stepper v-model="page" class="elevation-0">
        <v-stepper-header class="elevation-1">
          <v-stepper-step step="1" :complete="page > 1">Account</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="2" :complete="page > 2">General</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3" :complete="page > 3">Golf</v-stepper-step>
        </v-stepper-header>
        <v-stepper-content step="1">
          <v-form ref="form" v-model="valid">

            <v-layout row>
              <v-flex xs-12>
                <v-text-field
                  name="email"
                  label="Mail"
                  id="email"
                  v-model="email"
                  type="email"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs-12>
                <v-text-field
                  name="password"
                  label="Password"
                  id="password"
                  v-model="password"
                  type="password"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs-12>
                <v-text-field
                  name="confirmPassword"
                  label="Confirm Password"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  :rules="passwordRules"
                ></v-text-field>
              </v-flex>
            </v-layout>

          </v-form>
        </v-stepper-content>
        <v-stepper-content step="2">
          <!--<v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>-->
          <user-card ref="user"></user-card>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card>
            <golf-card  :editMode="true" ref="golf"></golf-card>
          </v-card>
        </v-stepper-content>
      </v-stepper>
      <v-layout row style="height: auto">
        <v-btn color="primary" :disabled="page > 3 || page <= 1" @click.native="page = Math.max(1,page-1)">Back</v-btn>
        <v-spacer style="height: 1px"></v-spacer>
        <v-btn color="primary" :disabled="!valid || loading" :loading="loading" @click.native="nextPage()">Continue</v-btn>
      </v-layout>
  </v-card>
</template>
<script>
import firebase from 'firebase'
import GolfuserProfileCard from './components/GolfuserProfileCard'
import UserProfileCard from './components/UserProfileCard'
export default {
  data () {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
      model: undefined,
      page: 1,
      valid: true,
      loading: false,
      passwordRules: [
        (v) => ((!!v && v === this.password) || (this.model && this.model.isSocial)) || 'Passwords do not match'
      ]
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/')
      }
    },
    $route: function () {
      this.init()
    },
    model: function (newVal) {
      if (this.model && this.model.isSocial) {
        this.valid = true
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init: function () {
    },
    async onSignup () {
      if (this.valid) {
        await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        this.model.userKey = firebase.auth().currentUser.uid
        this.model.save()
      }
      // this.$store.dispatch('signUserUp', { email: this.email, password: this.password })
    },
    nextPage: async function () {
      let golf = this.$refs.golf
      let user = this.$refs.user
      let pageObject = {2: user, 3: golf}
      if (!this.valid) return
      if (this.page < 3) {
        if (this.page === 1) {
          if (this.$refs.form.validate()) {
            this.page += 1
          }
        }
        if (pageObject[this.page].submit()) {
          this.page += 1
        }
      } else {
        this.submit()
        // this.$router.push({name: 'event', params: {id: this.model.key}})
      }
    },
    submit: async function () {
      this.loading = true

      let golf = this.$refs.golf
      let user = this.$refs.user

      if (!(this.valid && golf.isValid() && user.isValid())) {
        this.error = 'There was missing information! Please make sure you filled in everything correctly.'
        this.loading = false
        return
      }

      let userModel = user.getModel()
      userModel.nickname = userModel.nickname.toLowerCase()
      userModel.firstName = userModel.firstName.toLowerCase()
      userModel.lastName = userModel.lastName.toLowerCase()

      let golfModel = golf.getModel()

      if (userModel && !userModel.isSocial) {
        console.log('MAKING ACCOUNT!')
        await firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(error => { this.error = error.message })
        let uid = firebase.auth().currentUser.uid
        userModel.key = uid
        golfModel.key = uid
      } else {
        this.$store.commit('setUser', userModel)
      }

      golfModel.userKey = userModel._getDocRef()

      console.log('SAVING')
      console.log(firebase.auth().currentUser)
      userModel.save()
      golfModel.save()

      this.loading = false
    },
    makeSocialUser: function (filledModel) {
      this.model = filledModel
      console.log(filledModel)
      this.$refs.user.setModel(filledModel)
      this.page = 2
      console.log('MAKING SOCIAL USER')
    }
  },
  components: {
    'golf-card': GolfuserProfileCard,
    'user-card': UserProfileCard
  }
}
</script>
<style scoped>
</style>
