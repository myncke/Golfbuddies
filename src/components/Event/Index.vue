<template>
  <v-tabs dark v-model="active">
  <v-tabs-bar class="green">
    <v-tabs-item
      v-for="tab in tabs"
      :key="tab"
      :href="'#' + tab"
      ripple
    >
      {{ tab }}
    </v-tabs-item>
    <v-tabs-slider color="yellow"></v-tabs-slider>
  </v-tabs-bar>
  <v-tabs-items>
    <v-tabs-content
      v-for="tab in tabs"
      :key="tab"
      :id="tab"
    >
      <v-card flat>
        <v-card-text>{{ text }}</v-card-text>
      </v-card>
    </v-tabs-content>
  </v-tabs-items>
</v-tabs>
</template>
<script>
export default {
  data () {
    return {
      tabs: ['Explore', 'Calendar', 'Clubs'],
      active: null,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  methods: {
    next () {
      this.active = this.tabs[(this.tabs.indexOf(this.active) + 1) % this.tabs.length]
    }
  }
}
</script>
<style scoped>
</style>