<template>
  <v-menu full-width offset-y>
    <p class="red--text" v-if="error != ''">{{error}}</p>
    <v-btn slot="activator" flat @click="seenNotifications()" class="pa-0" style="min-width:50px;">
      <v-badge overlay color="red" overlap>
        <span v-if="countUnseenNotifications() > 0" slot="badge">{{countUnseenNotifications()}}</span>
        <v-icon left>notifications</v-icon>
      </v-badge>
      <p class="hidden-sm-and-down subheading mb-0"> NOTIFICATIONS</p>
    </v-btn>
    <v-list dark>
      <v-list-tile v-for="model in models" :key="model.key">
        <v-list-tile-title @click="clickedItem(model)">{{model.message}}</v-list-tile-title>
        <v-list-tile-action>
          <v-btn icon @click="removeNotification(model)">
            <v-icon dark>clear</v-icon>
          </v-btn>
        </v-list-tile-action>
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
        NotificationModel.listenToNotifications(object => {
          this.models.push(...(object.added))
          this.models = this.models.filter(model => {
            for (let obj of object.removed) {
              if (model.key === obj.key) {
                return false
              }
            }
            return true
          })
        }, error => { this.error = error.message })
        // this.models = await NotificationModel.getMyNotifications(error => { throw error })
      },
      clickedItem: function (model) {
        this.$router.push(model.link)
      },
      seenNotifications: function () {
        for (let model of this.models) {
          model.receivers[this.$store.getters.user.key].seen = true
          model.save()
        }
      },
      countUnseenNotifications: function () {
        return this.models.filter(model => !model.receivers[this.$store.getters.user.key].seen).length
      },
      async removeNotification (model) {
        await model.deleteObject()
        this.models = this.models.filter(obj => obj.key !== model.key)
      }
    }
  }
</script>

<style>

</style>
