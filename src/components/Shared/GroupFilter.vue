<template>

</template>

<script>
  // TODO: make a filter for the clubs

  export default {
    data: () => ({
      start: null,
      end: null,
      group_size: null,
      hdc: 1,
      select: [],
      items: [
        'International',
        'Competition',
        'Buggie',
        'Overnight'
      ],
      sexes: PrefGameSex,
      sex: null
    }),
    methods: {
      getFilterObject: function () {
        console.log(this.start)
        return {
          start: this.start,
          end: this.end,
          group_size: this.group_size,
          hdc: this.hdc,
          select: this.select,
          sex: this.sex
        }
      }
    },
    components: {
    }
  }
</script>

<style>

</style>
