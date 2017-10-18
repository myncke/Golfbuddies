export default {
  makeInitialsImage: function (user) {
    return 'https://ui-avatars.com/api/?name=' + user.firstName + '+' + user.lastName + '&rounded=true'
  }
}
