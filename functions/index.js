const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

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

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const hosting = functions.config().hosting.root;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

const APP_NAME = 'GolfBuddies';

exports.sendWelcomeEmail = functions.firestore
  .document('Notification/{notifId}')
  .onCreate(event => {
    const prevData = event.data.previous.data()
    const newDate = event.data.data()
    const user = event.data;

    const email = user.email;
    const displayName = user.displayName;

    return sendWelcomeEmail(email);
});

function sendInviteEmail (email, gameKey) {
  const mailOptions = {
    from: '${APP_NAME} <noreply@firebase.com>',
    to: email
  };

  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey there! Someone invited you to their game, log in and see what's going on! \n ${hosting + '#/event/' + gameKey}`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New welcome email sent to:', email);
  }).catch(error => console.log(error));
}

