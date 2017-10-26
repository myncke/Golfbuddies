<template>
  <v-layout column>
    <h6 class="caption">Events & travels</h6>
    <v-flex>
      <v-card>
        <v-list dense>
          <template v-for="(item, i) in items">
            <v-list-tile @click="" :key="i" :to="item.path">
              <v-list-tile-action>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{item.name}}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
        <v-card-actions>
          <v-btn flat outline block color="green" :to="'/event/new'">Create new event</v-btn>
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
      { name: 'Upcomming', icon: 'update', path: '/feed' },
      { name: 'Calendar', icon: 'events', path: '/calendar' },
      { name: 'Discover', icon: 'search', path: '/events' },
      { name: 'Past', icon: 'history', path: '/history' }
    ]
  })
}
</script>
