<template>
  <!-- TODO: this needs a substring search -->
  <v-select
    label="Async items"
    autocomplete
    :loading="loading"
    dark
    multiple
    cache-items
    chips
    required
    :items="items"
    :search-input.sync="search"
    v-model="select"
  ></v-select>
</template>

<script>
  export default {
    data: () => ({
      selectedUsers: [],
      search: '',
      items: [],
      loading: false
    }),
    methods: {
      searchUser: async function () {
        this.loading = true
        this.items = await UserModel.getNormalRef(UserModel).where()
        this.loading = false
      }
    },
    watch: {
      search (val) {
        this.search = val
        this.searchUser(val)
      }
    },
  }
</script>

<style scoped>

</style>
