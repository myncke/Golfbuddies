<template>
  <v-menu v-model="items" offset-y>
    <p class="red--text" v-if="error != ''">{{error}}</p>
    <v-text-field slot="activator" :solo="toolbar" prepend-icon="search" placeholder="Search User" v-on:keyup.enter="search()" v-model="inputStr"></v-text-field>
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
      inputStr: '',
      items: [],
      error: ''
    }),
    watch: {
      inputStr () {
        this.items = []
      }
    },
    methods: {
      search: async function () {
        console.log(this.inputStr)
        if (this.inputStr) {
          this.items = (await UserModel.searchUser(this.inputStr, error => { this.error = error.message }))
          if (this.items.length === 0) {
            this.items = [{firstName: 'No results', nickname: '', lastName: '', noResult: true}]
          }
        } else {
          this.items = []
        }
      },
      emitSelect: function (item) {
        if (!item.noResult) {
          this.$emit('search-selected', item)
        }
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
