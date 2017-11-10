<template>
  <v-layout row wrap>
    <v-flex xs12>
      <p class="title">Admin Group Page</p>
    </v-flex>
    <v-flex lg6 xs12 v-for="group of currentGroups" :key="group.key">
      <div class="groupcard"></div>
      <group-card :club="group"></group-card>
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
      currentGroups: [],
      allGroups: [],
      startAt: 0
    }),
    created () {
      this.next()
    },
    watch: {
      startAt: function (newVal) {
        this.$emit('retrieved-models', Math.min(this.startAt, this.allGroups.length))
      }
    },
    methods: {
      deleteModel: async function (group) {
        group.deleteObject()
        this.currentGroups = this.currentGroups.filter((model) => model.key !== group.key)
      },
      next: async function () {
        this.$emit('loading', true)
        let startAfter = null
        if (this.currentGroups !== undefined && this.currentGroups.length > 0) {
          startAfter = this.currentGroups[this.currentGroups.length - 1].name
        }
        if (this.allGroups.length < this.startAt + 1) {
          await this.allGroups.push(...(await SportClubModel.getAllFromRef(SportClubModel.getNormalRef(SportClubModel).orderBy('name').limit(this.limit).startAfter(startAfter), SportClubModel, error => { this.error = error })))
        }
        this.currentGroups = undefined
        this.currentGroups = this.allGroups.slice(this.startAt, this.startAt + this.limit)
        this.startAt += this.limit
        this.$emit('loading', false)
      },
      previous: async function () {
        this.startAt -= this.limit
        this.currentGroups = undefined
        this.currentGroups = this.allGroups.slice(this.startAt - this.limit, this.startAt)
        console.log(this.currentGroups)
      }
    },
    props: {
      limit: Number
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
