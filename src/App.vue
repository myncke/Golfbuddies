<template>
  <div id="app">
    <!-- <header>
      <span>Vue.js PWA</span>
    </header> -->
    <!-- <main>
      <img src="./assets/logo.png" alt="Vue.js PWA">
      <router-view></router-view>
    </main> -->

    <!-- <v-app>
      <v-navigation-drawer app>
        Test
      </v-navigation-drawer>
      <v-toolbar app>
        Golfbuddies
      </v-toolbar>
      <main>
        <v-content>
          <v-container fluid>
            <router-view></router-view>
          </v-container>
        </v-content>
      </main>
      <v-footer app></v-footer>


      <v-botttom-nav></v-botttom-nav>
    </v-app> -->

    <v-app id="example-1">
      <v-navigation-drawer persistent v-model="drawer">
        <v-list>
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title >
                        <span>Menu</span>
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <template v-for="(item, index) in items">
                <v-list-tile :href="item.href" :to="{name: item.href}">
                    <v-list-tile-action>
                        <v-icon light v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </template>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar class="indigo" dark>
          <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
          <v-toolbar-title>Golfbuddies</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native.stop="openGithub()">
              <v-icon>home</v-icon>
          </v-btn>
      </v-toolbar>

      <main>
          <v-fade-transition mode="out-in">
              <router-view></router-view>
          </v-fade-transition>
      </main>

      <v-footer class="indigo" dark>
          <span>© 2017 - disjfa</span>
      </v-footer>
      
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
