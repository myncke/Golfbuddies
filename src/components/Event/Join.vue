<template>
  <div v-if="gameModel !== undefined && gameModel.invites !== undefined">
    <p class="red--text caption" v-if="error">{{error}}</p>
    <v-btn small flat value="going" :color="invited ? 'green' : hasPermission ? 'blue-grey' : 'red'" class="caption" @click="openDialog">
      <v-icon left dark color="" class="caption">{{hasPermission ? 'check' : 'clear'}}</v-icon> Going
    </v-btn>
    <v-dialog v-model="openMe">
      <v-card v-if="gameModel !== undefined">
        <v-card-title>
          <p class="title"> {{gameModel.title}} </p>
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
  </div>
</template>

<script>
  import GameModel, { GameUser } from '../../models/GameModel'

  export default {
    data: () => ({
      openMe: false,
      specialWishes: '',
      loading: false,
      gameUser: undefined,
      users: [],
      error: ''
    }),
    created: function () {
      this.initGameUser()
      this.initUsers()
    },
    computed: {
      invited: function () {
        return this.users.includes(this.$store.getters.user.key)
      },
      hasPermission () {
        console.log(!this.gameModel.inviteOnly)
        return (this.gameModel.invites[this.gameUser.key] || {invited: false}).invited || !this.gameModel.inviteOnly
      }
    },
    methods: {
      initUsers: async function () {
        let userlist = await this.gameModel.initSubcollection('GameUsers', error => { console.log(error) })
        for (let i = 0; i < userlist.length; i++) {
          this.users.push(userlist[i].key)
        }
      },
      openDialog: function () {
        if (!this.invited && this.hasPermission) {
          this.openMe = true
        }
      },
      join: async function () {
        if (this.hasPermission) {
          this.loading = true
          await this.gameModel.addSubcollectionDoc('GameUsers', this.gameUser, error => { this.error = error.message })
          let key = this.$store.getters.user.key
          this.gameModel.invites[key] = {invited: (this.gameModel.invites[key] || {invited: false}).invited, accepted: true}
          await this.gameModel.save()
          this.loading = false
          this.openMe = false
          this.$emit('user-joined', this.gameModel)
        } else {
          this.error = 'You don\'t have the permission to join this game'
        }
      },
      initGameUser: function () {
        console.log('CURRENT USER: ' + this.$store.getters.user.key)
        let gameUser = new GameUser(this.$store.getters.user.key)
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
