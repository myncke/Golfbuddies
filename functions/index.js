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

exports.sendInviteEmail = functions.firestore
  .document('Game/{eventId}')
  .onWrite(event => {
    const prevData = event.data.previous.data()
    const newData = event.data.data()
    console.log(prevData)
    console.log(newData)

    const newInvites = newData.invites
    const oldInvites = prevData.invites

    let promises = []
    let emails = Object.keys(newInvites)
    emails = emails.filter((element) => oldInvites[element] === undefined && isEmail(element))

    for (let email of emails) {
      promises.push(sendInviteEmail(reformEmail(email), event.params.eventId))
    }

    return Promise.all(promises).then(
      () => console.log('Sent all emails to', emails)
    )
});

function sendInviteEmail (email, gameKey) {
  const mailOptions = {
    from: `${APP_NAME}`,
    to: email
  };

  console.log(email)
  console.log(gameKey)

  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey there! Someone invited you to their game, log in and see what's going on! \n ${hosting + '#/event/' + gameKey}`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New welcome email sent to:', email);
  }).catch(error => console.log(error));
}

function isEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }
  // There must at least one character before the @ symbol and another after.
  let re = /^[^@]+@[^@]+$/;
  return re.test(email);
}

function reformEmail(email) {
  return email.replace(/,/g , ".");
}
