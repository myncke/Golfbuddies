<template>
  <v-card>
    <v-card-title>
      <p class="title">Invite Users</p>
    </v-card-title>
    <v-card-text>
      <p class="red--text">{{error}}</p>
      <p class="caption search-info">User search:</p>
      <user-search :toolbar="false" v-on:search-selected="addUser"></user-search>
      <p class="caption search-info">Group search:</p>
      <group-search :toolbar="false" v-on:search-selected="addGroup"></group-search>

      <v-layout row v-if="email">
        <v-flex xs12>
          <p class="caption search-info">Add emails:</p>
        </v-flex>
        <v-flex sm9 xs12>
          <v-text-field
            ref="emailfield"
            label="Invite by Email" v-model="emailString"
          ></v-text-field>
        </v-flex>
        <v-flex sm3 xs12>
          <v-btn color="primary" @click="addEmail(email)">Add Email</v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn flat @click.native="showGroups = !showGroups">
        <v-icon>{{ showGroups ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
        Invited Groups
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn flat @click.native="showUsers = !showUsers">
        <v-icon>{{ showUsers ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
        Invited Users
      </v-btn>
    </v-card-actions>
    <v-slide-y-transition>
      <v-card-text v-show="showUsers">
        <v-list subheader>
          <v-subheader>Invited Users</v-subheader>
          <v-list-tile avatar v-for="user in invitedUsers" v-bind:key="user.key" @click="">
            <v-list-tile-content v-if="user.firstName !== undefined">
              <v-list-tile-title v-html="user.nickname"></v-list-tile-title>
              <p class="caption">{{user.firstName}} {{user.lastName}}</p>
            </v-list-tile-content>
            <v-list-tile-content v-else>
              <v-list-tile-title>{{user.key}}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon color="teal" @click="removeUser(user)">clear</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card-text>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <v-card-text v-show="showGroups">
        <v-list subheader>
          <v-subheader>Invited Groups</v-subheader>
          <v-list-tile avatar v-for="group in invitedGroups" v-bind:key="group.key" @click="">
            <v-list-tile-content>
              <v-list-tile-title v-html="group.name"></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon color="teal" @click="removeGroup(group)">clear</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card-text>
    </v-slide-y-transition>
  </v-card>
</template>

<script>
  import UserSearch from '../../Shared/Search/UserSearch'
  import GroupSearch from '../../Shared/Search/GroupSearch'
  import StringUtils from '../../../utils/StringUtils'
  import GolfUserModel from '../../../models/GolfUserModel'
  export default {
    data: () => ({
      invitedUsers: [],
      invitedGroups: [],
      showUsers: false,
      showGroups: false,
      emailString: '',
      error: ''
    }),
    props: {
      model: Object,
      subModel: Object,
      email: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      /* model: function (newVal) {
      } */
    },
    created () {
      console.log(this.model)
    },
    methods: {
      removeUser: function (user) {
        this.removeObjectFromArray(this.invitedUsers, user)
        this.removeUserFromInvites(user.key)
      },
      addUser: async function (user) {
        this.user = ''
        if (this.invitedUsers.indexOf(user) < 0) {
          // TODO: this, we need the golfuser to check the subModels things
          if (!this.subModel) {
            this.invitedUsers.push(user)
            this.addUserToInvites(user.key)
          }
          let golfuser = await GolfUserModel.getFromRef(GolfUserModel.getNormalRef(GolfUserModel).doc(user.key), GolfUserModel, error => { this.error = error })
          console.log('USER INVITE', golfuser)
          if (this.model.canJoin(user) && this.subModel.canJoin(golfuser)) {
            this.invitedUsers.push(user)
            this.addUserToInvites(user.key)
          } else {
            this.error = 'Can\'t invite this user according to your event\'s rules'
          }
        }
      },
      addEmail: function () {
        console.log(this.emailString)
        if (StringUtils.isEmail(this.emailString)) {
          this.addUser({key: StringUtils.reformEmail(this.emailString)})
          this.emailString = ''
        } else {
          this.error = 'Incorrect email!'
        }
      },
      removeGroup: function (group) {
        this.removeObjectFromArray(this.invitedGroups, group)
        for (let key of Object.keys(group.members)) {
          if (this.searchByKey(this.invitedUsers, key) === undefined) {
            this.removeUserFromInvites(key)
          }
        }
      },
      addGroup: function (group) {
        if (this.invitedGroups.indexOf(group) < 0) {
          this.invitedGroups.push(group)
          for (let key of Object.keys(group.members)) {
            this.addUserToInvites(key)
          }
        }
      },
      searchByKey: function (array, key) {
        return array.find(obj => obj.key === key)
      },
      removeObjectFromArray: function (array, object) {
        let index = array.indexOf(object)
        if (index >= 0) {
          array.splice(index, 1)
        }
      },
      addUserToInvites: function (userKey) {
        this.model.invites[userKey] = {invited: true, accepted: (this.model.invites[userKey] || {accepted: false}).accepted}
      },
      removeUserFromInvites: function (userKey) {
        delete this.model.invites[userKey]
      }
    },
    components: {
      'user-search': UserSearch,
      'group-search': GroupSearch
    }
  }
</script>

<style>
  .search-info{
    margin-top: 20px
  }
</style>
