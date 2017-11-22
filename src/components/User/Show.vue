<template>
  <v-layout row wrap transition="slide-x-transition">
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <p class="title">Profile</p>
          <v-spacer></v-spacer>
          <v-switch label="Edit Mode" v-model="editMode" v-if="isMyProfile"></v-switch>
          <div v-else>
            <v-btn v-if="isAFriend" @click="removeFriend" flat>
              Remove Friend
            </v-btn>
            <v-btn v-else @click="addFriendRequest" flat>
              Add Friend
            </v-btn>
          </div>
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
              <v-text-field
                label="Phone Number"
                v-model="model.phone"
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
  import FriendshipModel from '../../models/FriendshipModel'

  let refs = ['golf']

  export default {
    data: () => ({
      model: undefined,
      editMode: false,
      countries: [],
      sexes: [],
      snackbar: false,
      loading: false,
      isFriend: undefined
    }),
    computed: {
      isMyProfile: function () {
        return this.model.key === this.$store.getters.user.key
      },
      isAFriend: function () {
        console.log(this.isFriend)
        return (this.isFriend !== undefined && this.isFriend.friends[this.$store.getters.user.key] === true)
      }
    },
    created: function () {
      this.init()
    },
    methods: {
      init: function () {
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
      initUserModel: async function (pId) {
        this.model = new UserModel(pId, false, model => {
          this.model = undefined
          this.model = model
          if (!this.isMyProfile) {
            this.initIsFriend()
          }
        }, error => { this.error = error.message })
      },
      initIsFriend: async function () {
        this.isFriend = (await FriendshipModel.getFriendship(this.model.key, this.$store.getters.user.key, error => console.log(error)))
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
      },
      addFriendRequest: async function () {
        if (this.isFriend === undefined) {
          this.isFriend = await FriendshipModel.sendRequest(this.model.key, false, error => console.log(error))
        } else {
          let isFriend = this.isFriend.friends[this.$store.getters.user.key]
          if (isFriend) {
            await this.isFriend.deleteObject() // TODO: rethink this
            this.isFriend = undefined
          } else {
            this.isFriend.friends[this.$store.getters.user.key] = true
            await this.isFriend.save()
          }
        }
      },
      removeFriend: async function () {
        this.isFriend.deleteObject()
      }
    },
    watch: {
      editMode: function (val) {
        this.setEditMode(val)
      },
      $route: function (newVal) {
        this.initUserModel()
      }
    },
    components: {
      'golf-info': GolfuserProfileCard
    }
  }
</script>
<style scoped>
</style>
