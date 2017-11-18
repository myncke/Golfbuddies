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
            <v-list-tile avatar :to="`/profile/${member.key}`">
              <v-list-tile-avatar>
                <img :src="makeInitialsImage(member)" class="initials-img" />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="capitalize">{{member.firstName}} {{member.lastName}}</v-list-tile-title>
                <v-list-tile-sub-title>{{member.region}}, {{member.nationality}} &#9679; {{ isGoing(member) ? "Going" : "Invited"}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
          </v-list>
        </v-flex>

      </v-layout>
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

  export default {
    data: () => ({
      invites: [],
      going: [],
      goingUsers: []
    }),
    computed: {
      amountGoing: function () {
        return this.going.length
      },
      amountInvited: function () {
        return this.invites.length
      }
    },
    created () {
      this.initGoing()
      this.initInvites()
      console.log(this.model.invites)
      console.log(this.model.invites)
      console.log(this.model.invites)
      console.log(this.going)
    },
    methods: {
      initGoing: async function () {
        let userlist = await this.model.initSubcollection('GameUsers', error => { console.log(error) })
        for (let i = 0; i < userlist.length; i++) {
          this.going.push(new UserModel(userlist[i].key, false, model => { this.goingUsers.push(model) }, error => console.log(error)))
        }
      },
      initInvites: async function () {
        let people = Object.keys(this.model.invites)
        for (let person of people) {
          this.invites.push(new UserModel(person, false, model => { this.goingUsers.push(model) }, error => console.log(error)))
        }
      },
      makeInitialsImage: function (user) {
        return ImageUtils.makeInitialsImage(user)
      },
      isGoing: function (object) {
        return this.going.includes(object)
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
