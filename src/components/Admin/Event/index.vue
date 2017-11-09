<template>

</template>

<script>
  import GameModel from '../../../models/GameModel'

  export default {
    data: () => ({
      currentEvents: []
    }),
    watch: {
      start: function (newVal) {
        this.updateEvents()
      }
    },
    created () {
      this.updateEvents()
    },
    methods: {
      updateEvents: async function () {
        this.currentEvents = await GameModel.getFromRef(GameModel.getNormalRef(GameModel).limit(this.limit).startAt(this.currentAmount), GameModel, error => { this.error = error })
      }
    },
    props: {
      start: Number,
      limit: Number
    }
  }
</script>

<style>

</style>
