<template>
  <v-card v-if="model !== undefined && userModel !== undefined">
    <v-card-media src="https://images.unsplash.com/photo-1504723246034-0977641ea907?auto=format&fit=crop&w=1744&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D" height="200px">
    </v-card-media>
    <v-card-title>
      <p class="title">{{userModel.nickname}} is Traveling!</p>
    </v-card-title>
    <v-card-text>
      <p class="subheading"><span class="title">From:</span> {{model.start.toDateString()}} <br> <span class="title">To:</span> {{model.end.toDateString()}}, <br> {{userModel.nickname}} is going to {{model.location}}</p>
    </v-card-text>
  </v-card>
</template>

<script>
  import LocationBroadcastModel from '../../models/LocationBroadcastModel'
  import UserModel from '../../models/UserModel'
  export default {
    data: () => ({
      model: undefined,
      userModel: undefined
    }),
    watch: {
      $route: function (newVal) {
        this.initModel()
      }
    },
    created () {
      this.initModel()
    },
    methods: {
      initModel: function () {
        let modelId = this.$route.params.id
        this.model = new LocationBroadcastModel(modelId, false, model => { this.model = model; this.initUserModel() }, error => console.log(error))
      },
      initUserModel: async function () {
        this.userModel = await UserModel.getFromRef(this.model.userKey, UserModel, error => console.log(error))
      }
    }
  }
</script>

<style>

</style>
