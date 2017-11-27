import firebase from 'firebase'

export default class MessagingHandler {

  static messaging = undefined
  static token = undefined

  static async init () {
    MessagingHandler.messaging = firebase.messaging()

    if ('serviceWorker' in navigator) {
      await navigator.serviceWorker.register('/static/firebase-messaging-sw.js').then((registration) => {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
        MessagingHandler.messaging.useServiceWorker(registration)
      }).catch(function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err)
      })
    }

    MessagingHandler.messaging.requestPermission()
      .then(function () {
        console.log('Notification permission granted.')

        MessagingHandler.initToken()
      })
      .catch(function (err) {
        console.log('Unable to get permission to notify.', err)
      })
  }

  static async initToken () {
    MessagingHandler.messaging.getToken()
      .then((currentToken) => {
        if (currentToken) {
          // console.log(currentToken)
          MessagingHandler.token = currentToken
          // sendTokenToServer(currentToken);
          // updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log('No Instance ID token available. Request permission to generate one.')
          // Show permission UI.
          // updateUIForPushPermissionRequired();
          // setTokenSentToServer(false);
        }
      })
      .catch(function (err) {
        console.log('An error occurred while retrieving token. ', err)
        console.log('Error retrieving Instance ID token. ', err)
        // setTokenSentToServer(false);
      })
  }
}
