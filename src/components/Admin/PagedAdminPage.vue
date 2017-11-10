<template>
  <v-layout row wrap>
    <v-flex xs12>
      <component v-on:loading="isLoading" v-on:retrieved-models="updateAmount" ref="page" :limit="limit" v-if="type !== undefined" v-bind:is="type"></component>
    </v-flex>

    <v-flex xs12>
      <v-layout row>
        <v-btn :disabled="isFirst" color="primary" @click="getPreviousPage()">Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn :loading="loading" :disabled="isLast || loading" color="primary" @click="getNextPage()">Next</v-btn>
      </v-layout>
    </v-flex>

  </v-layout>
</template>

<script>
  import AdminEventIndex from './Event/index'
  import AdminGroupIndex from './Group/index'
  // import AdminEventIndex from './Event/index'

  export default {
    data: () => ({
      currentAmount: 0,
      currentEventsAmount: 0,
      currentIndex: 0,
      limit: 2,
      type: undefined,
      loading: false
    }),
    watch: {
      $route: function (newVal) {
        this.init()
      }
    },
    computed: {
      isLast: function () {
        return (this.currentIndex % this.limit) !== 0
      },
      isFirst: function () {
        return this.currentIndex - this.limit <= 0
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        let user = this.$store.getters.user
        console.log(user)
        if (!user.isAdmin) {
          this.$router.push('/')
          console.log('MISSING PERMISSION!')
          return
        }
        if (this.$route.params.type === 'events') {
          this.type = 'event-pages'
          console.log('EVENT PAGE')
        } else if (this.$route.params.type === 'groups') {
          this.type = 'group-pages'
        }
      },
      getNextPage: async function () {
        // this.currentEvents = await GameModel.getFromRef(GameModel.getNormalRef(GameModel).limit(this.limit).startAt(this.currentAmount), GameModel, error => { this.error = error })
        if (!this.isLast) {
          this.$refs.page.next()
        }
      },
      getPreviousPage: async function () {
        if (!this.isFirst) {
          this.$refs.page.previous()
        }
      },
      updateAmount: function (amount) {
        this.currentIndex = amount
      },
      isLoading: function (isLoading) {
        this.loading = isLoading
      }
    },
    components: {
      'event-pages': AdminEventIndex,
      'group-pages': AdminGroupIndex
    }
  }
</script>

<style>

</style>
