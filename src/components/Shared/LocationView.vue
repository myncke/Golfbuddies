<template>
  <div style="width: 100%;height: 100%;">
    <iframe v-if="location !== undefined" :width="width || '100%'" :height="height || '450px'" frameborder="0" style="border:0;"
            :src="'https://www.google.com/maps/embed/v1/place?q=' + location.latitude + ',+' + location.longitude + '&key=AIzaSyDuD6-jAzk7Gk7mko708x0VYslipwsoEt8'" allowfullscreen></iframe>
  </div>
</template>

<script>
  export default {
    data: () => ({
    }),
    props: {
      location: undefined,
      height: String,
      width: String
    }
  }
</script>

<style>

</style>
