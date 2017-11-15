<template>
  <v-layout column>
    <h6 class="caption">Events & travels</h6>
    <v-flex>
      <v-card>
        <v-list dense>
          <template v-for="(item, i) in items">
            <v-tooltip right>
              <v-list-tile @click="" :key="i" :to="item.path" slot="activator">

                <v-list-tile-action>
                  <v-icon>{{item.icon}}</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{item.name}}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <span>{{item.info}}</span>
            </v-tooltip>
          </template>
        </v-list>
        <v-card-actions>
          <v-btn flat outline block color="green" :to="'/event/new'">Create new event</v-btn>
          <v-btn flat outline color="green" :to="'/locationBroadcast/new'">Travel</v-btn>
        </v-card-actions>
      </v-card>
      <v-layout column>
        
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    items: [
      { name: 'Upcoming', icon: 'update', path: '/feed', info: 'All upcoming events you are invited to or are going to.' },
      { name: 'Calendar', icon: 'events', path: '/calendar', info: 'Calendar of all upcoming events and travels.' },
      { name: 'Discover', icon: 'search', path: '/events', info: 'Filter public events.' }
      // { name: 'Past', icon: 'history', path: '/history', info: '' }
    ]
  })
}
</script>
