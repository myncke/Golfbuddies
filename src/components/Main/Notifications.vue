<template>
  <v-menu full-width offset-y>
    <p class="red--text" v-if="error != ''">{{error}}</p>
    <v-btn slot="activator" flat @click="seenNotifications()">
      <v-badge overlay color="red" overlap left>
        <span v-if="countUnseenNotifications() > 0" slot="badge">{{countUnseenNotifications()}}</span>
        <v-icon left>notifications</v-icon>
      </v-badge>
      <p class="hidden-sm-and-down subheading mb-0"> NOTIFICATIONS</p>
    </v-btn>
    <v-list dark>
      <v-list-tile v-for="model in models" :key="model.key" @click="clickedItem(model)">
        <v-list-tile-title>{{model.message}}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>

</template>

<script>
  import NotificationModel from '../../models/NotificationModel'

  export default {
    data: () => ({
      models: [],
      error: ''
    }),
    created: function () {
      this.initModels()
    },
    methods: {
      initModels: async function () {
        this.models = await NotificationModel.getMyNotifications(error => { throw error })
      },
      clickedItem: function (model) {
        this.$router.push(model.link)
      },
      seenNotifications: function () {
        for (let model of this.models) {
          model.receivers[this.$store.getters.user.id].seen = true
          model.save()
        }
      },
      countUnseenNotifications: function () {
        return this.models.filter(model => !model.receivers[this.$store.getters.user.id].seen).length
      }
    }
  }
</script>

<style>

</style>
