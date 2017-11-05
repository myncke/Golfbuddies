const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.firestore
  .document('Notification/{notifId}')
  .onCreate(event => {

    console.log('Started Notifying')

    let newValue = event.data.data();

    //TODO: we still need to add a nice icon to the notifications!

    // Notification details.
    const payload = {
      notification: {
        title: 'You have a new notification!',
        body: newValue.message,
        clickAction: newValue.link
      }
    };

    let promiseArray = []
    let notifPromiseArray = []

    try {
      for (let key of Object.keys(newValue.receivers)) {
        let notPromise = admin.firestore().doc('Users/' + key + '/NotificationInfo/deviceGroups').get().then(
          documentSnapshot => {
            let data = documentSnapshot.data();
            for (let token of data.tokens) {
              let promise = admin.messaging().sendToDevice(token, payload)
              promiseArray.push(promise)
            }
          }
        ).catch(error => console.log(error))
        notifPromiseArray.push(notPromise)
      }

      // [...promiseArray, ...notifPromiseArray]
      Promise.all(notifPromiseArray.concat(promiseArray)).then(
        () => {
          console.log('Finished')
          return 0
        }
      ).catch(error => {
        console.log(error)
        return 1
      })
    } catch (error) {
      console.log('ERROR', error)
      return 1
    }

  });