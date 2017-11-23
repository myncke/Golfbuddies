<template>
  <v-card v-if="model != undefined">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h6 class="caption"><strong>{{amountGoing}} going &#9679; {{amountInvited}} invited </strong></h6>
          <!--  &#9679; 0 maybe -->
        </v-flex>

        <v-flex xs12>
          <v-list two-line>
          <template v-for="member of goingUsers">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img v-if="isUserModel(member)" :src="makeInitialsImage(member)" class="initials-img" />
              </v-list-tile-avatar>
              <v-list-tile-content :to="`/profile/${member.key}`">
                <v-list-tile-title v-if="isUserModel(member)" class="capitalize">{{member.firstName}} {{member.lastName}}</v-list-tile-title>
                <v-list-tile-title v-else class="capitalize">{{member}}</v-list-tile-title>
                <v-list-tile-sub-title v-if="isUserModel(member)">{{member.region}}, {{member.nationality}} &#9679; {{ isGoing(member) ? "Going" : "Invited"}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action v-if="isMyEvent">
                <v-btn icon ripple @click="openSpecialWishes(member)">
                  <v-icon color="grey lighten-1">comment</v-icon>
                </v-btn>
                <v-btn icon ripple @click="removeUser(member)">
                  <v-icon color="grey lighten-1">clear</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
          </v-list>
        </v-flex>
      </v-layout>

      <v-dialog v-model="openMe">
        <v-card v-if="gameUser !== undefined">
          <v-card-title>
            <p class="title"> {{gameUser.userModel.firstName}} {{gameUser.userModel.lastName}} </p>
          </v-card-title>
          <v-card-text>
            <v-text-field
              label="Message/Special Wishes"
              v-model="gameUser.specialWishes"
              multiLine
              disabled
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-dialog>

    </v-container>
    <!-- <v-divider></v-divider>
    <v-card-action>
      <v-btn flat>Invite Friends</v-btn>
    </v-card-action> -->
  </v-card>
</template>

<script>
  import UserModel from '../../../models/UserModel'
  import ImageUtils from '../../../utils/ImageUtils'
  import StringUtils from '../../../utils/StringUtils'
  import { GameUser } from '../../../models/GameModel'

  export default {
    data: () => ({
      invites: [],
      going: [],
      goingUsers: [],
      gameUser: undefined,
      openMe: false
    }),
    computed: {
      amountGoing: function () {
        return this.going.length
      },
      amountInvited: function () {
        return this.invites.length
      },
      isMyEvent: function () {
        return this.model.getCreator() === this.$store.getters.user.key
      }
    },
    created () {
      this.initGoing()
      this.initInvites()
      console.log(this.model.invites)
      console.log(this.going)
    },
    methods: {
      init: async function () {
        this.invites = []
        this.going = []
        this.goingUsers = []
        await this.initGoing()
        await this.initInvites()
      },
      initGoing: async function () {
        let userlist = await this.model.initSubcollection('GameUsers', error => { console.log(error) })
        for (let i = 0; i < userlist.length; i++) {
          this.going.push(new UserModel(userlist[i].key, false, model => { this.addModelToGoing(model) }, error => console.log(error)))
        }
      },
      initInvites: async function () {
        let people = Object.keys(this.model.invites)
        for (let person of people) {
          if (this.model.invites[person].invited && !this.model.invites[person].accepted) {
            if (StringUtils.isEmail(person)) {
              this.invites.push(person)
              this.addModelToGoing(person)
            } else {
              this.invites.push(new UserModel(person, false, model => {
                this.addModelToGoing(model)
              }, error => console.log(error)))
            }
          }
        }
        console.log(this.invites)
        this.invites = this.invites.filter(model => {
          let array = this.going.filter(model2 => model.key === model2.key)
          console.log(array)
          return array.length === 0
        })
        // console.log(this.invites)
      },
      addModelToGoing (model) {
        this.goingUsers.push(model)
        let object = {}
        for (let obj of this.goingUsers) {
          if (obj && obj.key) {
            object[obj.key] = obj
          } else {
            object[obj] = StringUtils.translateEmail(obj)
          }
        }
        this.goingUsers = Object.values(object)
      },
      makeInitialsImage: function (user) {
        return ImageUtils.makeInitialsImage(user)
      },
      isGoing: function (object) {
        return this.going.includes(object)
      },
      isUserModel (model) {
        return (model && model.firstName)
      },
      removeUser (model) {
        delete this.model.invites[model.key]
        this.model.save()
        this.model.removeSubColDoc('GameUsers', model.key, error => { this.error = error.message })
      },
      async openSpecialWishes (model) {
        console.log(model.key)
        this.gameUser = await this.model.getSubcollectionDoc('GameUsers', model.key, GameUser, error => { this.error = error.message /* Silent Error */ })
        if (this.gameUser) {
          this.gameUser.userModel = model
          this.openMe = true
        }
      }
    },
    props: {
      model: Object
    }
  }
</script>

<style scoped>
  .initials-img {
    width: 40px;
    height: 40px;
    display: inline;
  }
</style>
