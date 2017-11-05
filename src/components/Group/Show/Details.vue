<template>
  <v-container>
    <v-layout column>
      <v-flex v-if="model !== undefined">
        <h6>Owner</h6>
        <v-card class="elevation-0">
          <v-list two-line>
            <v-list-tile avatar :to="`/profile/${model.key}`">
              <v-list-tile-avatar>
                <img :src="makeInitialsImage(model)" class="initials-img" />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="capitalize">{{model.firstName}} {{model.lastName}}</v-list-tile-title>
                <v-list-tile-sub-title>{{model.region}}, {{model.nationality}} </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>

      <v-flex v-if="location !== undefined">
        <h6>Location</h6>
        <location-card :location="location"></location-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import LocationView from '../../Shared/LocationView'
  import ImageUtils from '../../../utils/ImageUtils'
  import UserModel from '../../../models/UserModel'

  export default {
    data: () => ({
      model: undefined
    }),
    props: [
      'location',
      'owner'
    ],
    created: function () {
      this.initOwner(this.owner.id)
    },
    methods: {
      makeInitialsImage: function (user) {
        return ImageUtils.makeInitialsImage(user)
      },
      initOwner: async function (id) {
        this.model = new UserModel(id, false, model => { this.model = undefined; this.model = model }, error => { this.error = error.message })
      }
    },
    components: {
      'location-card': LocationView
    }
  }
</script>
