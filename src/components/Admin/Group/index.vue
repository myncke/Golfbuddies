<template>
  <v-layout row wrap>
    <v-flex xs12>
      <p class="title">Admin Group Page</p>
    </v-flex>
    <v-flex lg6 xs12 v-for="group of currentmodels" :key="group.key">
      <div class="groupcard"></div>
      <group-card v-if="group !== undefined" :club="group"></group-card>
      <v-btn color="primary" class="deletebutton" @click="deleteModel(group)" block>Delete Group</v-btn>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>
</template>

<script>
  import GroupCard from '../../Group/components/GroupCard'
  import SportClubModel from '../../../models/SportClubModel'

  export default {
    data: () => ({
    }),
    created () {
      this.next()
    },
    methods: {
      deleteModel: async function (group) {
        group.deleteObject()
        this.$emit('deleted-model', group)
      },
      addModels: async function (last) {
        let startAfter = null
        if (last) {
          startAfter = last.name
        }
        return await SportClubModel.getAllFromRef(SportClubModel.getNormalRef(SportClubModel).orderBy('name').limit(this.limit).startAfter(startAfter), SportClubModel, error => { this.error = error })
      }
    },
    props: {
      limit: Number,
      currentmodels: Array
    },
    components: {
      'group-card': GroupCard
    }
  }
</script>

<style scoped>
  .groupcard{
    margin-top: 20px;
  }
  .deletebutton{
    margin-bottom: 20px;
  }
</style>
