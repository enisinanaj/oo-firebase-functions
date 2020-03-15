const functions = require("firebase-functions");
const moment = require("moment");
const admin = require("firebase-admin");
const { Expo } = require("expo-server-sdk");
admin.initializeApp();
let expo = new Expo();

exports.oroscopoGiornaliero = functions.https.onRequest(async (req, res) => {
  let messages = [];
  await admin
    .firestore()
    .collection("Utenti")
    .where("notificationToken", ">", "")
    .get()
    .then(response =>
      response.forEach(doc => {
        if (
          moment(doc.data().ultimoAccesso).isBefore(moment().startOf("day")) &&
          Expo.isExpoPushToken(doc.data().notificationToken)
        ) {
          messages.push({
            to: doc.data().notificationToken,
            sound: "default",
            body:
              "Ciao " +
              doc.data().nome +
              "! Non hai ancora letto il tuo oroscopo di oggi, che aspetti? ⏳",
            data: { tipologia: "giornaliero" },
            channelId: "Giornaliero"
          });
        }
      })
    );
  // MANDO LE NOTIFICHE

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    /* eslint-disable no-await-in-loop */
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
      } catch (error) {
        console.error(error);
      }
    }
    res.json(tickets)
    /* eslint-enable no-await-in-loop */
  })();
});

exports.biscottoDellaFortuna = functions.https.onRequest(async (req, res) => {
  let messages = [];
  await admin
    .firestore()
    .collection("Utenti")
    .where("notificationToken", ">", "")
    .get()
    .then(response =>
      response.forEach(doc => {
        if (
          Expo.isExpoPushToken(doc.data().notificationToken) &&
          (doc.data().ultimoBiscottoAperto === null ||
            moment(doc.data().ultimoBiscottoAperto).isBefore(
              moment().startOf("day")
            ))
        ) {
          messages.push({
            to: doc.data().notificationToken,
            sound: "default",
            body:
              "Ti sei dimenticato di aprire il biscotto della fortuna di oggi? Dai " +
              doc.data().nome +
              ", per fortuna c'è Only a ricordartelo 😎",
            data: { tipologia: "biscotto" },
            channelId: "Biscotto"
          });
        }
      })
    );

  // MANDO LE NOTIFICHE
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    /* eslint-disable no-await-in-loop */
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
      } catch (error) {
        console.error(error);
      }
    }
    
    res.json(tickets)
    /* eslint-enable no-await-in-loop */
  })();
});
