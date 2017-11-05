<template>
  <v-menu v-model="input" offset-y>
    <p class="red--text" v-if="error != ''">{{error}}</p>
    <v-text-field slot="activator" :solo="toolbar" prepend-icon="search" placeholder="Search User" v-on:keyup.enter="search()" @input="val => input = val"></v-text-field>
    <v-list>
      <v-list-tile v-for="item in items" :key="item.key" @click="emitSelect(item)">
        <v-list-tile-title>{{capitalize(item.nickname)}} - {{capitalize(item.firstName)}} {{capitalize(item.lastName)}}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
  import UserModel from '../../../models/UserModel'
  import StringUtils from '../../../utils/StringUtils'

  export default {
    data: () => ({
      input: '',
      items: [],
      error: ''
    }),
    methods: {
      search: async function () {
        this.items = await UserModel.searchUser(this.input, error => { this.error = error.message })
      },
      emitSelect: function (item) {
        this.$emit('search-selected', item)
      },
      capitalize: function (c) {
        return StringUtils.capitalize(c)
      }
    },
    props: {
      toolbar: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style scoped>

</style>
