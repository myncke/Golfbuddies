<template>
  <v-layout>
    <v-dialog v-model="openMe">
      <v-card v-if="gameModel !== undefined">
        <v-card-title>
          <p class="title"> Join Game </p>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Message/Special Wishes"
            v-model="gameUser.specialWishes"
            multiLine
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" :loading="loading" @click="join()">
            Join Game
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import GameModel, { GameUser } from '../../models/GameModel'

  export default {
    data: () => ({
      openMe: false,
      specialWishes: '',
      loading: false,
      gameUser: undefined
    }),
    created: function () {
      this.initGameUser()
    },
    methods: {
      openDialog: function () {
        this.openMe = true
        console.log(this.openMe)
      },
      join: async function () {
        this.loading = true
        await this.gameModel.addSubcollectionDoc('GameUsers', this.gameUser, error => { this.error = error.message })
        this.loading = false
        this.openMe = false
      },
      initGameUser: function () {
        console.log('CURRENT USER: ' + this.$store.getters.user.id)
        let gameUser = new GameUser(this.$store.getters.user.id)
        gameUser.specialWishes = ''
        this.gameUser = gameUser
      }
    },
    props: {
      gameModel: GameModel
    }
  }
</script>

<style>

</style>
