<template>
  <div>
    <h1 class="headline">Calendar</h1>
    <v-card>
      <v-card-text>
        <full-calendar :config="{contentHeight: 400}" v-on:event-selected="eventSelected" defaultView="month" :events="events"></full-calendar>
      </v-card-text>
      <v-card-actions>
        <v-btn flat outline block color="blue" :to="'/event/new'">Create new event</v-btn>
        <v-btn flat outline block color="yellow darken-2" :to="'/locationBroadcast/new'">Add a travel</v-btn>
      </v-card-actions>
    </v-card>
    <br>
    <event-filter></event-filter>
  </div>
</template>

<script>
  import GameModel from '../../models/GameModel'
  import UserModel from '../../models/UserModel'
  import FriendshipModel from '../../models/FriendshipModel'
  import LocationBroadcastModel from '../../models/LocationBroadcastModel'
  import EventFilter from '../Event/Index'

  export default {
    data: () => ({
      events: [],
      games: [],
      locationBroadcasts: []
    }),
    watch: {
      games: function (newVal) {
        this.fillEvents()
      },
      locationBroadcasts: function (newVal) {
        this.fillEvents()
      }
    },
    created: function () {
      this.initGames()
      this.initLocationBroadcasts()
    },
    methods: {
      initGames: async function () {
        let result = await GameModel.getJoinedGames(error => console.log(error))
        result.push(...(await GameModel.getMyGames(error => console.log(error))))
        let object = {}
        for (let obj of result) {
          object[obj.key] = obj
        }
        this.games = Object.values(object)
        // console.log(this.games)
      },
      initLocationBroadcasts: async function () {
        this.locationBroadcasts = []
        let resultObj = {}
        let friendList = await FriendshipModel.getFriendsOfCurrentUser(error => console.log(error))

        // Friends
        for (let model of friendList) {
          let result = await LocationBroadcastModel.getBroadcastsFromUserOrdered(model.getFriendRef(), error => console.log(error))
          for (let obj of result) {
            resultObj[obj.key] = obj
          }
        }

        // Current user
        let personalTravels = await LocationBroadcastModel.getBroadcastsFromUserOrdered((this.$store.getters.user._getDocRef()), error => console.log(error))
        for (let obj of personalTravels) {
          resultObj[obj.key] = obj
        }
        this.locationBroadcasts = Object.values(resultObj)
        // console.log(this.locationBroadcasts)
      },
      eventSelected: function (event, jsEvent, view) {
        if (event.isEvent) {
          this.$router.push({name: 'event', params: {id: event.id}})
        } else {
          this.$router.push({name: 'locationBroadcast', params: {id: event.id}})
        }
      },
      gamesToEvents: function () {
        for (let game of this.games) {
          this.events.push({
            title: '[Event] ' + game.title,
            start: game.date,
            color: 'blue',
            textColor: 'white',
            id: game.key,
            isEvent: true
          })
        }
      },
      locationsToEvents: async function () {
        for (let location of this.locationBroadcasts) {
          let user = await UserModel.getFromRef(location.userKey, UserModel, error => console.log(error))
          let event = {
            title: '[Location] ' + user.nickname + ' - ' + location.location,
            start: location.start,
            end: location.end,
            color: 'yellow',
            textColor: 'black',
            id: location.key,
            isEvent: false
          }
          this.events.push(event)
        }
      },
      fillEvents: function () {
        this.events = []
        this.gamesToEvents()
        this.locationsToEvents()
        // console.log(this.events)
      }
    },
    components: {
      'event-filter': EventFilter
    }
  }

</script>

<style scoped>
  @import '~fullcalendar/dist/fullcalendar.css';
</style>
