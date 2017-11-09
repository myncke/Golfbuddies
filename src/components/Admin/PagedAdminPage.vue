<template>
  <component v-if="type !== undefined" v-bind:is="type"></component>
</template>

<script>
  import AdminEventIndex from './Event/index'
  // import AdminEventIndex from './Event/index'

  export default {
    data: () => ({
      currentAmount: 0,
      currentEvents: [],
      limit: 25,
      type: undefined
    }),
    created () {
      let user = this.$store.getters.user
      console.log(user)
      if (!user.isAdmin) {
        this.$router.push('/')
        return
      }
      if (this.$route.params.type === 'event') {
        this.type = 'event-pages'
        console.log('EVENT PAGE')
      } else {
        // FIXME
        this.type = undefined
      }
    },
    methods: {
      getNextPage: async function () {
        // this.currentEvents = await GameModel.getFromRef(GameModel.getNormalRef(GameModel).limit(this.limit).startAt(this.currentAmount), GameModel, error => { this.error = error })
        if (this.currentEvents === this.limit) {
          this.currentAmount += this.limit
        }
      },
      getPreviousPage: async function () {
        if (this.currentAmount >= this.limit) {
          this.currentAmount -= this.limit
        }
      }
    },
    components: {
      'event-pages': AdminEventIndex
    }
  }
</script>

<style>

</style>
