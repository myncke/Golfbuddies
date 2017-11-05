<template>
  <v-layout>
    <v-flex>
      <v-card>
        <v-list>
          <v-btn flat>My pictures</v-btn>
        </v-list>
        <v-container fluid v-bind="{ [`grid-list-${size}`]: true }">
          <v-layout row wrap>
            <v-flex
              xs4
              v-for="n in 9"
              :key="n"
            >
              <v-card flat tile>
                <v-card-media
                  :src="`https://unsplash.it/100/100?image=${Math.floor(Math.random() * 100) + 1}`"
                  height="100px"
                >
                </v-card-media>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>
