<template>
   <v-card class="ma-3" v-if="false" >  <!--  model != undefined && model.game != undefined -->


    <v-card-text>
      <v-layout row>
        <v-spacer></v-spacer>
        <p class="d-inline-block title">{{model.game.date.toDateString()}}</p>
      </v-layout>


      <!-- BOOLEANS -->

      <v-layout row wrap>
        <v-flex lg3 sm6 xs12>
          <v-checkbox label="International"
                      color="primary"
                      :input-value="model.game.international"
                      value
                      disabled
                      hide-details></v-checkbox>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <v-checkbox label="Competition"
                      color="primary"
                      :input-value="model.game.competition"
                      value
                      disabled
                      hide-details></v-checkbox>
        </v-flex>
        <v-flex lg3 sm6 xs12 v-if="model.buggie !== undefined">
          <v-checkbox label="Buggie"
                      v-model="model.buggie"
                      color="primary"
                      :input-value="model.buggie"
                      value
                      disabled
                      hide-details></v-checkbox>
        </v-flex>
        <v-flex lg3 sm6 xs12 v-if="model.overnight !== undefined">
          <v-checkbox label="Overnight"
                      color="primary"
                      :input-value="model.overnight"
                      value
                      disabled
                      hide-details></v-checkbox>
        </v-flex>
      </v-layout>

      <v-divider></v-divider>

      <!-- Default information -->

      <v-layout row wrap style="margin-top: 10px">
        <v-flex sm6 xs12>
          <p class="subheading">Preferred Group Size: {{model.game.prefGroupSize}}</p>
        </v-flex>
        <v-flex sm6 xs12>
          <p class="subheading">Current Group Size: {{model.participants.length}}</p>
        </v-flex>
        <v-flex sm6 xs12>
          <p class="subheading">Preferred Group: {{model.game.prefGameSex}}</p>
        </v-flex>
      </v-layout>

      <v-divider></v-divider>

      <!-- SportType specific information -->

      <v-layout row v-if="model.buggie !== undefined">
        <v-flex sm6 xs12>
          <p class="subheading">Minimum Handicap: {{model.minHdc}}</p>
        </v-flex>
        <v-flex sm6 xs12>
          <p class="subheading">Round Price: {{model.roundPrice}}</p>
        </v-flex>
      </v-layout>

      <!-- TODO: make a page where a user can sign up for a game -->
      <!-- TODO: make sure the user is the correct gender before they can join  -->
      <v-btn block color="green" class="white--text" :disabled="(model.participants.length > model.game.prefGroupSize)" @click="'TODO!!!'">Join Game!</v-btn>
      <v-btn block color="blue" class="white--text" @click="'TODO!!!'">Open Game Page</v-btn>
    </v-card-text>
    <v-card-actions>
      <v-btn icon @click.native="showMembers = !showMembers; showLocation = false">
        <v-icon>{{ showMembers ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
      </v-btn>
      <p>Members</p>
      <v-spacer></v-spacer>
      <p>Location</p>
      <v-btn icon @click.native="showLocation = !showLocation; showMembers = false">
        <v-icon>{{ showLocation ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-slide-y-transition>
      <v-card-text v-show="showLocation" v-if="model.game.location !== undefined">
        <location-view :location="model.game.location"></location-view>
      </v-card-text>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <v-card-text v-show="showMembers">
        <div v-for="member in model.participants">
          <img :src="makeInitialsImage(member.user)" class="initials-img" /><p class="member subheading">{{member.user.firstName}} {{member.user.lastName}} - {{member.user.nickname}}</p>
          <p class="subheading">Special Wishes: </p>
          <p>{{member.user.specialWishes}}</p>
          <v-divider></v-divider>
        </div>
      </v-card-text>
    </v-slide-y-transition>
  </v-card>
</template>
