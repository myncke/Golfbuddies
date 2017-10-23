<template>
  <v-menu v-model="input" offset-y>
    <v-text-field slot="activator" solo prepend-icon="search" placeholder="Search User" class="hidden-sm-and-down" v-on:keyup.enter="search()" @input="val => input = val"></v-text-field>
    <v-list>
      <v-list-tile v-for="item in items" :key="item.key" @click="goToProfile(item)">
        <v-list-tile-title>{{capitalize(item.nickname)}} - {{capitalize(item.firstName)}} {{capitalize(item.lastName)}}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
  import UserModel from '../../models/UserModel'
  import StringUtils from '../../utils/StringUtils'

  export default {
    data: () => ({
      input: '',
      items: []
    }),
    methods: {
      search: async function () {
        this.items = await UserModel.searchUser(this.input, error => { throw error })
      },
      goToProfile: function (item) {
        this.$emit('search-selected', item)
      },
      capitalize: function (c) {
        return StringUtils.capitalize(c)
      }
    }
  }
</script>

<style scoped>

</style>
