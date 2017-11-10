<template>
  <v-card v-if="model !== undefined">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h6 class="caption"><strong>{{amountGoing}} going &#9679; 0 maybe</strong></h6>
        </v-flex>


        <v-flex xs12>
          <template v-for="member of goingUsers">
            <v-list-tile avatar :to="`/profile/${member.key}`">
              <v-list-tile-avatar>
                <img :src="makeInitialsImage(member)" class="initials-img" />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="capitalize">{{member.firstName}} {{member.lastName}}</v-list-tile-title>
                <v-list-tile-sub-title>{{member.region}}, {{member.nationality}} </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-flex>

      </v-layout>
    </v-container>
    <v-divider></v-divider>
    <v-card-action>
      <v-btn flat>Invite Friends</v-btn>
    </v-card-action>
  </v-card>
</template>

<script>
  import UserModel from '../../../models/UserModel'
  import ImageUtils from '../../../utils/ImageUtils'

  export default {
    data: () => ({
      goingUsers: []
    }),
    computed: {
      amountGoing: function () {
        return this.getGoingPeople().length
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        let people = this.getGoingPeople()
        this.goingUsers = []
        for (let person of people) {
          console.log(new UserModel(person, false, model => { this.goingUsers.push(model) }, error => console.log(error)))
        }
      },
      getGoingPeople: function () {
        let result = Object.keys(this.model.invites)
        return result.filter((obj) => this.model.invites[obj].accepted)
      },
      makeInitialsImage: function (user) {
        return ImageUtils.makeInitialsImage(user)
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
