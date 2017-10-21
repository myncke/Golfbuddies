<template>
  <div class="green lighten-1 message-card" style="width: 100%">
    <v-card class="elevation-20">
      <v-card-title>
        <p class="caption">{{model.timestamp.toDateString()}}</p>
        <v-spacer></v-spacer>
        <p class="title" v-if="sender != undefined">{{sender.nickname}}</p>
      </v-card-title>
      <v-card-text>

        <p v-if="error !== ''" class="red--text">{{error}}</p>
        <p class="subheading">{{model.text}}</p>

        <br>
        <v-divider></v-divider>
        <br>

        <v-container fluid v-bind="{ [`grid-list-xs`]: true }">
          <v-layout row wrap>
            <v-flex
              md3 sm4 xs12
              v-for="picture in model.pictures"
              :key="picture"
            >
              <v-card flat tile>
                <v-card-media
                  :src="picture"
                  height="150px"
                  @click="openedImage = picture; showImage = true"
                >
                </v-card-media>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <v-dialog :max-width="'100%'" v-model="showImage">
      <v-container fluid>
        <v-layout row>
          <img class="large-message-img" :src="openedImage"/>
        </v-layout>
      </v-container>
    </v-dialog>
  </div>
</template>

<script>
  import MessageModel from '../../../../models/MessageModel'
  import UserModel from '../../../../models/UserModel'

  export default {
    data: () => ({
      sender: undefined,
      error: '',
      showImage: false,
      openedImage: ''
    }),
    props: {
      model: MessageModel
    },
    created: function () {
      this.initSender()
    },
    methods: {
      initSender: async function () {
        this.sender = await MessageModel.getFromRef(this.model.sender, UserModel, error => { this.error = error.message })
      }
    }
  }
</script>

<style scoped>

  .message-card{
    padding: 10px;
  }

  .large-message-img{
    object-fit: cover;
    max-height: 70vh;
    max-width: 80vw;
    margin: auto;
    /* max-width: 100%;
    max-height: 100%; */
  }

</style>
