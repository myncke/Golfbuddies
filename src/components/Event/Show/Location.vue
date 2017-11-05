<template>
  <v-container>
    <location-card :location="location"></location-card>
  </v-container>
</template>

<script>
import LocationView from '../../Shared/LocationView'

export default {
  data: () => ({
  }),
  props: [ 'location' ],
  created: function () {
  },
  methods: {
  },
  components: {
    'location-card': LocationView
  }
}
</script>

