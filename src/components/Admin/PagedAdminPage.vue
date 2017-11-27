<template>
  <v-layout row wrap>

    <v-flex xs12>
      <p class="display-2">Admin Page</p>
    </v-flex>

    <v-flex xs12>
      <v-layout row>
        <v-btn :disabled="isFirst" color="primary" @click="getPreviousPage()">Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn :loading="loading" :disabled="isLast || loading" color="primary" @click="getNextPage()">Next</v-btn>
      </v-layout>
    </v-flex>

    <v-flex xs12>
      <component v-on:deleted-model="filterModels" v-on:loading="isLoading" ref="page" :currentmodels="currentModels" :limit="limit" v-if="type !== undefined" v-bind:is="type"></component>
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
      currentModels: [],
      allModels: [],
      startAt: 0,
      limit: 2,
      type: undefined,
      loading: false,
      last: Number.MAX_VALUE
    }),
    watch: {
      $route: function (newVal) {
        this.init()
      }
    },
    computed: {
      isLast: function () {
        return this.startAt >= this.last
      },
      isFirst: function () {
        return this.startAt - this.limit <= 0
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        let user = this.$store.getters.user
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
          this.next()
        }
      },
      next: async function () {
        this.loading = true
        let last
        if (this.currentModels !== undefined && this.currentModels.length > 0) {
          last = this.currentModels[this.currentModels.length - 1]
        }
        if (this.allModels.length < this.startAt + 1) {
          let result = await this.$refs.page.addModels(last)
          if (result.length === 0) {
            this.last = this.startAt
          }
          await this.allModels.push(...(result))
        }
        this.currentModels = undefined
        this.updateSlice()
        this.startAt += this.limit
        this.loading = false
      },
      updateSlice: function () {
        if (this.startAt >= this.allModels.length) {
          this.startAt -= this.limit
        }
        this.currentModels = this.allModels.slice(this.startAt, this.startAt + this.limit)
      },
      getPreviousPage: async function () {
        if (!this.isFirst) {
          this.previous()
        }
      },
      previous: async function () {
        console.log(this.allModels.slice(this.startAt - this.limit, this.startAt))
        this.startAt -= this.limit
        this.currentModels = undefined
        this.currentModels = this.allModels.slice(this.startAt - this.limit, this.startAt)
      },
      filterModels: function (model) {
        this.allModels = this.allModels.filter((obj) => obj.key !== model.key)
        this.currentModels = this.currentModels.filter((obj) => obj.key !== model.key)
        this.last -= 1
        this.updateSlice()
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
