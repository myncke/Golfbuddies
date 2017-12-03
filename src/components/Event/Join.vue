<template>
  <div v-if="gameModel !== undefined && gameModel.invites !== undefined">
    <p class="red--text caption" v-if="error">{{error}}</p>
    <v-btn v-if="!isMyGame" small flat
           value="going"
           :color="invited ? (!accepted ? 'green' : 'red') : 'blue-grey'"
           class="caption" @click="accepted ? unjoinGame() : openDialog()"
           :disabled="(!hasPermission && !accepted) || isMyGame">
      <v-icon left dark color="" class="caption">{{!accepted ? 'check' : 'clear'}}</v-icon> {{accepted ? 'Cancel invitation' : (hasPermission ? 'Join' : 'Not allowed')}}
    </v-btn>
    <v-btn flat small v-else disabled class="caption">
      My event
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
  import GolfUserModel from '../../models/GolfUserModel'
  import GolfGameModel from '../../models/GolfGameModel'

  export default {
    data: () => ({
      openMe: false,
      specialWishes: '',
      loading: false,
      gameUser: undefined,
      myModel: undefined,
      subModel: undefined,
      users: [],
      error: ''
    }),
    created: function () {
      this.initGameUser()
      this.initUsers()
    },
    computed: {
      invited: function () {
        let user = this.$store.getters.user
        return this.users.includes(user.key) || this.gameModel.getCreator() === user.key || (this.gameModel.invites[user.key] || {invited: false}).invited
      },
      accepted: function () {
        return (this.gameModel.invites[this.$store.getters.user.key] || {accepted: false}).accepted || this.isMyGame
      },
      isMyGame () {
        let user = this.$store.getters.user
        return this.gameModel.getCreator() === user.key
      },
      canJoin () {
        return !this.accepted && this.hasPermission
      },
      hasReadPermission () {
        return (this.invited || !this.gameModel.inviteOnly)
      },
      hasPermission () {
        let user = this.$store.getters.user
        return this.myModel && this.gameModel && this.subModel && this.hasReadPermission && this.gameModel.canJoin(user) && this.subModel.canJoin(this.myModel)
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
        if (this.canJoin) {
          this.openMe = true
        }
      },
      join: async function () {
        if (this.hasPermission) {
          this.loading = true
          await this.gameModel.addSubcollectionDoc('GameUsers', this.gameUser, error => { this.error = error.message })
          let user = this.$store.getters.user
          this.gameModel.invites[user.key] = {invited: (this.gameModel.invites[user.key] || {invited: false}).invited, accepted: true}
          this.users.push(user)
          await this.gameModel.save()
          this.refreshModel()
          this.loading = false
          this.openMe = false
          this.$emit('user-joined', this.gameModel)
        } else {
          this.error = 'You don\'t have the permission to join this game'
        }
      },
      initGameUser: async function () {
        let userKey = this.$store.getters.user.key
        this.myModel = new GolfUserModel(userKey, false, model => { this.myModel = undefined; this.myModel = model }, error => { this.error = error.message })
        // console.log('CURRENT USER: ' + userKey)
        let gameUser = new GameUser(userKey)
        gameUser.specialWishes = ''
        this.gameUser = gameUser
        this.subModel = await GolfGameModel.getFromRef(this.gameModel.subGame, GolfGameModel, error => { this.error = error })
      },
      unjoinGame: async function () {
        console.log('DELETING')
        let userKey = this.$store.getters.user.key
        this.gameModel.removeSubColDoc('GameUsers', userKey, error => { this.error = error })
        delete this.gameModel.invites[userKey]
        this.gameModel.save()
        console.log('DELETED')
        this.users = this.users.filter(obj => obj.key !== userKey)
        this.refreshModel()
        this.$emit('user-quit', this.gameModel)
      },
      refreshModel () {
        let model = this.gameModel
        this.gameModel = undefined
        this.gameModel = model
      }
    },
    props: {
      gameModel: GameModel
    }
  }
</script>

<style>

</style>
