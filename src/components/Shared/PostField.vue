<template>
  <v-container fluid class="pa-0">



    <v-layout row wrap>
      <v-flex>
        <v-expansion-panel  class="elevation-1 light-green">
          <v-expansion-panel-content v-for="(item,i) in 1" :key="i" class="light-green">
            <div slot="header"> Post [WIP]</div>
            <v-card>

              <v-layout row wrap>
                <v-flex>
                  <v-card>
                    <v-toolbar color="light-green" dense dark>
                      <v-toolbar-title>Post</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-icon color="white">send</v-icon>


                    </v-toolbar>
                    <v-container fluid class="pa-0 mt-2">
                      <v-layout wrap>
                        <v-flex xs2>
                          <v-subheader>To</v-subheader>
                        </v-flex>
                        <v-flex xs10 class="text-xs-right">
                          <v-chip>
                            <v-avatar>
                              <img src="https://randomuser.me/api/portraits/men/92.jpg" />
                            </v-avatar>
                            Trevor Hansen
                          </v-chip>
                          <v-chip>
                            <v-avatar>
                              <img src="https://randomuser.me/api/portraits/men/91.jpg" />
                            </v-avatar>
                            Alex Nelson
                          </v-chip>
                        </v-flex>
                        <v-flex xs12>
                          <v-divider></v-divider>
                          <v-text-field
                            label="Subject"
                            value="Plans for the weekend"
                            single-line
                            full-width
                            hide-details
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-divider></v-divider>
                          <v-text-field
                            label="Message"
                            v-model="title"
                            counter
                            max="120"
                            full-width
                            multi-line
                            single-line
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>


    
  </v-container>
</template>

