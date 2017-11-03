const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.firestore
  .document('Notification/{notifId}')
  .onCreate(event => {

    console.log('TEST')

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
      console.log(newValue)
      for (let key of Object.keys(newValue.receivers)) {
        console.log(key)
        let notPromise = admin.firestore().doc('Users/' + key + '/NotificationInfo/deviceGroups').get().then(
          documentSnapshot => {
            let data = documentSnapshot.data();
            console.log(`Retrieved data: ${JSON.stringify(data)}`);
            for (let token of data.tokens) {
              console.log(token)
              let promise = admin.messaging().sendToDevice(token, payload).then(response => {
                console.log(response)
              });
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
