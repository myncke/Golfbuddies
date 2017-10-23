<template>
  <v-container fill-height class="background ma-0">
    <v-layout row justify-center>
      <v-flex xs12 sm6>
        <v-card flat dark class="green darken-2 border__card">
          <v-card-text class="pa-3">
            <h1 class="title">GOLFBUDDIES</h1>
            <v-card class="section-def__card">
              <v-card-text class="pa-0">
                <v-container class="pa-0">
                  <v-tabs light fixed centered >

                    <v-tabs-bar dark class="white">
                      <v-tabs-slider class="yellow"></v-tabs-slider>
                      <v-tabs-item
                        v-for="i in items"
                        :key="i"
                        :href="'#tab-' + i"
                      >
                        {{ i }}
                      </v-tabs-item>
                    </v-tabs-bar>
                    <hr class="divider">

                    <v-tabs-items >
                      <v-tabs-content
                        v-for="i in items"
                        :key="i"
                        :id="'tab-' + i"
                      >

                        <sign-in v-if="i == 'Sign In'"> </sign-in>
                        <sign-up v-else> </sign-up>

                      </v-tabs-content>
                    </v-tabs-items>

                  </v-tabs>
                </v-container>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Signin from '../User/Signin'
  import Signup from '../User/Signup'
  export default {
    components: {
      'sign-in': Signin,
      'sign-up': Signup
    },
    data: () => ({
      items: [ 'Sign In', 'Sign Up' ]
    })
  }
</script>

<style scoped>
  .background {
    background-image: url('/static/img/latem.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 100vh;
    min-width: 100%;
  }

  .section-def__card {
    top: 24px;
    margin-top: -24px;
  }

  .border__card {
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
  }
</style>

