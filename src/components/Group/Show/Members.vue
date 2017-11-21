<template>
  <v-layout>
    <v-flex>
      <v-card>
        <v-list two-line>
          <template v-for="member in members">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img :src="makeInitialsImage(member)" class="initials-img" />
              </v-list-tile-avatar>
              <v-list-tile-content :to="`/profile/${member.key}`">
                <v-list-tile-title class="capitalize">{{member.firstName}} {{member.lastName}}</v-list-tile-title>
                <v-list-tile-sub-title>{{member.region}}, {{member.nationality}} </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action v-if="iscreator">
                <v-btn icon ripple @click="removeUser(member)">
                  <v-icon color="grey lighten-1">clear</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import ImageUtils from '../../../utils/ImageUtils'

  export default {
    data: () => ({
    }),
    props: {
      members: Array,
      iscreator: Boolean
    },
    created: function () {
    },
    methods: {
      makeInitialsImage: function (user) {
        return ImageUtils.makeInitialsImage(user)
      },
      removeUser: function (user) {
        this.$emit('remove-user', user)
      }
    },
    components: {
    }
  }
</script>

<style scoped>
  .capitalize {
    text-transform: capitalize;
  }
  .initials-img {
    width: 40px;
    height: 40px;
    display: inline;
  }
</style>
