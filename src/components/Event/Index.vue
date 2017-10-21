<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout>
      <v-flex>

        <v-container fluid class="ma-0 pa-0" >
          <v-layout>
            <v-flex>
              <v-expansion-panel>
                <v-expansion-panel-content v-model="open">
                  <v-divider></v-divider>
                  <div slot="header">
                    <v-icon class="mr-3" left>filter_list</v-icon> Filters
                    <!-- <v-icon class="ml-5">event</v-icon>
                    <span class="ml-3">Oct.</span>
                    <span class="ml-1">2017</span> -->
                  </div>
                  <v-card>
                    <v-card-text class="grey lighten-5">
                      <v-layout row wrap>
                        <v-flex sx12 sm5>
                          <menu-date-picker></menu-date-picker>
                          <menu-date-picker></menu-date-picker>

                            <v-layout wrap>
                            <v-flex xs12>
                              <v-select
                                v-model="select"
                                label="Extra Filters"
                                chips
                                tags
                                :items="items"
                              ></v-select>
                            </v-flex>
                          </v-layout>
                        </v-flex>

                        <v-flex sm5 offset-sm1>
                          <v-layout row wrap>
                            <v-flex xs10>
                              <v-slider prepend-icon="group" :max="8" v-model="group_size"></v-slider>
                            </v-flex>
                            <v-flex xs2>
                              <v-text-field v-model="group_size" type="number"></v-text-field>
                            </v-flex>
                            <v-flex xs10>
                              <v-slider prepend-icon="accessible" :max="50" v-model="hdc"></v-slider>
                            </v-flex>
                            <v-flex xs2>
                              <v-text-field v-model="hdc" type="number"></v-text-field>
                            </v-flex>

                            <v-flex>
                              <v-select
                                v-bind:items="sex"
                                v-model="e1"
                                label="Select"
                                single-line
                                auto
                                prepend-icon="accessibility"
                                hide-details
                              ></v-select>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-divider></v-divider>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-flex>
          </v-layout>
        </v-container>

        <index-tabs></index-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import IndexTabs from './components/IndexTabs'
  import MenuDatePicker from '../Shared/MenuDatePicker'

  export default {
    data: () => ({
      start: null,
      end: null,
      open: true,
      group_size: 4,
      hdc: 1,
      select: [],
      items: [
        'International',
        'Competition',
        'Buggie',
        'Overnight'
      ],
      sex: [
        'Men only',
        'Woman only',
        'Mixed'
      ]
    }),
    components: {
      'index-tabs': IndexTabs,
      'menu-date-picker': MenuDatePicker
    }
  }
</script>
