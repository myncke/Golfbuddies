<template>
  <v-layout row wrap transition="slide-x-transition">
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <p class="title">Profile</p>
          <v-spacer></v-spacer>
          <v-switch label="Edit Mode" v-model="editMode" v-if="isMyProfile"></v-switch>
        </v-card-title>
        <v-card-text v-if="model !== undefined">

          <v-layout row wrap>

            <!-- Text Fields -->

            <v-flex sm6 xs12 class="pa-3">
              <v-text-field
                label="First Name"
                v-model="model.firstName"
                :disabled="!editMode"
              ></v-text-field>
            </v-flex>

            <v-flex sm6 xs12 class="pa-3">
              <v-text-field
                label="Last Name"
                v-model="model.lastName"
                :disabled="!editMode"
              ></v-text-field>
            </v-flex>

            <v-flex sm6 xs12 class="pa-3">
              <v-text-field
                label="Nickname"
                v-model="model.nickname"
                :disabled="!editMode"
              ></v-text-field>
            </v-flex>

            <v-flex xs12></v-flex>

            <v-flex sm6 xs12 class="pa-3">
              <v-select v-if="editMode"
                        :items="countries"
                        v-model="model.nationality"
                        label="Select"
                        single-line
                        prepend-icon="map"
              ></v-select>

              <v-text-field v-else
                label="Nationality"
                v-model="model.nationality"
                :disabled="!editMode"
              ></v-text-field>
            </v-flex>

            <v-flex sm6 xs12 class="pa-3">
              <v-text-field
                label="Region/Province"
                v-model="model.region"
                :disabled="!editMode"
              ></v-text-field>
            </v-flex>

            <v-flex sm6 xs12 class="pa-3">
              <v-radio-group v-model="model.sex">
                <v-radio v-for="sex in sexes"
                         :key="sex"
                         :disabled="!editMode"
                         :label="sex"
                         :value="sex"
                ></v-radio>
              </v-radio-group>
            </v-flex>

          </v-layout>

          <v-divider></v-divider>

          <golf-info :pId="this.model.key" ref="golf"></golf-info>


        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-btn block color="primary" :loading="loading" @click="save()" v-if="editMode">
        Save
      </v-btn>
    </v-flex>
    <v-snackbar
      :timeout="6000"
      color="success"
      v-model="snackbar"
    >
      Successfully saved your Profile
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>
<script>
  import UserModel, {sexes} from '../../models/UserModel'
  import LocationUtils from '../../utils/LocationUtils'
  import GolfuserProfileCard from './components/GolfuserProfileCard'

  let refs = ['golf']

  export default {
    data: () => ({
      model: undefined,
      editMode: false,
      countries: [],
      sexes: [],
      snackbar: false,
      loading: false
    }),
    computed: {
      // TODO: insert logic here, will do this when I have the latest store
      isMyProfile: function () {
        return this.model.key === this.$store.getters.currentUser
      }
    },
    created: function () {
      let pId = this.$route.params.id
      if (pId === undefined) {
        if (this.$store.getters.currentUser === null) {
          pId = this.$store.getters.currentUser.id
        } else {
          this.$router.push('/')
        }
      }

      this.countries = LocationUtils.countries
      this.sexes = sexes
      this.initUserModel(pId)
    },
    methods: {
      initUserModel: async function (pId) {
        this.model = new UserModel(pId, false, model => { this.model = undefined; this.model = model }, error => { this.error = error.message })
      },
      setEditMode: function (mode) {
        for (let ref of refs) {
          this.$refs[ref].setEditMode(mode)
        }
      },
      save: async function () {
        this.loading = true
        for (let ref of refs) {
          await this.$refs[ref].save()
        }
        await this.model.save()
        console.log('SAVED USERMODEL')
        this.loading = false
        this.editMode = false
        this.snackbar = true
      }
    },
    watch: {
      editMode: function (val) {
        this.setEditMode(val)
      }
    },
    components: {
      'golf-info': GolfuserProfileCard
    }
  }
</script>
<style scoped>
</style>
