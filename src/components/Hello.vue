<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="http://chat.vuejs.org/" target="_blank" rel="noopener">Vue Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank" rel="noopener">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><button v-on:click="makeUser('Af3ug111EfTLf2PLAbf70GWEJew2')">Test User</button></li>
      <li><button v-on:click="makeGame('uPNmM5JOnfKGdbDl2vuh')">Test Game</button></li>
      <li><button v-on:click="makeSportClub('UMotjtm55NXUdmaFVTiD')">Test Club</button></li>
    </ul>
  </div>
</template>

<script>
import UserModel from '../models/UserModel'
import GameModel from '../models/GameModel'
import SportClubModel from '../models/SportClubModel'
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js PWA'
    }
  },
  methods: {
    makeUser: function (key) {
      const model = new UserModel(key, false, model => {
        console.log(model._toJson()) // On Success, print the model
        model['nationality'] = 'Swagland' // Change a field from the object
        model.save(() => console.log(model), error => console.log(error)) // Save the object :D
      }, error => console.log(error))
      console.log(model)
    },
    makeGame: function (key) {
      const game = new GameModel(key, false, model => {
        console.log(model._toJson())
        model['competition'] = !model['competition']
        model.save(() => console.log(model._toJson()), error => console.log(error))
      }, error => console.log(error))
      game.initSubcollection('GameUsers', list => console.log(list), error => console.log(error))
      console.log(game)
    },
    makeSportClub: function (key) {
      const club = new SportClubModel(key, false, model => {
        console.log(model._toJson())
        model.closed = !model.closed
        model.save(() => console.log(model._toJson()), error => console.log(error))
      }, error => console.log(error))
      club.initSubcollection('Members', list => console.log(list), error => console.log(error))
      club.initSubcollection('Games', list => console.log(list), error => console.log(error))
      console.log(club)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
</style>
