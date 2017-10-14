<template>
  <div>
    <h1>Contact - Index</h1>
    <p class="error">{{error}}</p>
    <div v-for="friend in friends">
      <p>{{friend.getUser1()}}</p>
    </div>
  </div>
</template>
<script>
  import firebase from 'firebase'
  import FriendshipModel from '../../models/FriendshipModel'
  import UserModel from '../../models/UserModel'
  export default {
    data () {
      return {
        friends: [],
        error: ''
      }
    },
    created () {
      firebase.auth().signInWithEmailAndPassword('omg.kvb@gmail.com', 'kekkek').then(
        () => {
          FriendshipModel.getFriendsOfUser(new UserModel(), list => {
            console.log(list)
            this.friends = list
          }, error => {
            this.error = error.message
          })
          let ref = FriendshipModel.getNormalRef(FriendshipModel)
          // ref.where('userKey2', '==', 'firestore.googleapis.com/project/golfbuddies-ef806/database/(default)/documents/Users/Af3ug111EfTLf2PLAbf70GWEJew2')
          FriendshipModel.getAllFromRef(ref, FriendshipModel, (list) => {
            console.log(list)
            this.friends = list
          })
        },
        error => {
          this.error = error.message
        }
      )
    }
  }
</script>
<style scoped>
</style>
