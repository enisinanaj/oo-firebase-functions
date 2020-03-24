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
    res.json(tickets);
    /* eslint-enable no-await-in-loop */
  })();
});

exports.oroscopoSettimanale = functions.https.onRequest(async (req, res) => {
  let messages = [];
  await admin
    .firestore()
    .collection("Utenti")
    .where("notificationToken", ">", "")
    .get()
    .then(response =>
      response.forEach(doc => {
        if (Expo.isExpoPushToken(doc.data().notificationToken)) {
          messages.push({
            to: doc.data().notificationToken,
            sound: "default",
            body:
              "Ciao " +
              doc.data().nome +
              "! Non hai ancora letto il tuo oroscopo di questa settimana, che aspetti? ⏳",
            data: { tipologia: "settimanale" },
            channelId: "Settimanale"
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
    res.json(tickets);
    /* eslint-enable no-await-in-loop */
  })();
});

exports.oroscopoMensile = functions.https.onRequest(async (req, res) => {
  let messages = [];
  await admin
    .firestore()
    .collection("Utenti")
    .where("notificationToken", ">", "")
    .get()
    .then(response =>
      response.forEach(doc => {
        if (Expo.isExpoPushToken(doc.data().notificationToken)) {
          messages.push({
            to: doc.data().notificationToken,
            sound: "default",
            body:
              "Ciao " +
              doc.data().nome +
              "! Non hai ancora letto il tuo oroscopo di questo mese, che aspetti? ⏳",
            data: { tipologia: "mensile" },
            channelId: "Mensile"
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
    res.json(tickets);
    /* eslint-enable no-await-in-loop */
  })();
});

exports.nuovaRubrica = functions.https.onRequest(async (req, res) => {
  const segno = req.query.segno.toString();
  const titolo = req.query.titolo.toString();
  const slug = req.query.slug.toString();
  let messages = [];
  await admin
    .firestore()
    .collection("Utenti")
    .where("segno", "==", segno)
    .where("notificationToken", ">", "")
    .get()
    .then(response =>
      response.forEach(doc => {
        if (Expo.isExpoPushToken(doc.data().notificationToken)) {
          messages.push({
            to: doc.data().notificationToken,
            sound: "default",
            body: titolo,
            data: { tipologia: "rubrica", slug: slug },
            channelId: "Rubrica"
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
    res.json(tickets);
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

    res.json(tickets);
    /* eslint-enable no-await-in-loop */
  })();
});

exports.notificaPopup = functions.https.onRequest(async (req, res) => {
  const utente = req.query.utente.toString();

  const datiUtente = await admin
    .firestore()
    .collection("Utenti")
    .doc(utente)
    .get()
    .then(response => {
      return response.data();
    });

  const oggi = moment().format("DD/MM");
  const compleanno = moment(datiUtente.dataDiNascita, "DD/MM/YYYY").format(
    "DD/MM"
  );
  if (compleanno === oggi && datiUtente.compleannoFesteggiato !== true) {
    await admin
      .firestore()
      .collection("Utenti")
      .doc(utente)
      .update({ compleannoFesteggiato: true });

    res.json({
      tipologia: "compleanno",
      titolo: "Buon compleanno!",
      descrizione: "Ciao, " + datiUtente.nome + ", tanti auguri!",
      testoBottone: "Festeggia!",
      urlImmagine:
        "https://www.oetker.co.uk/Recipe/Recipes/oetker.co.uk/uk-en/baking/image-thumb__3337__RecipeDetailsLightBox/sprinkles-birthday-cake.jpg"
    });
  } else {
    if (compleanno !== oggi) {
      await admin
        .firestore()
        .collection("Utenti")
        .doc(utente)
        .update({ compleannoFesteggiato: false });
    }

    const popup = await admin
      .firestore()
      .collection("Popup")
      .doc("Messaggio")
      .get()
      .then(response => {
        let popup = response.data();
        popup.titolo = popup.titolo
          .replace(/NOME/g, datiUtente.nome)
          .replace(/SEGNO/g, datiUtente.segno);
        popup.descrizione = popup.descrizione
          .replace(/NOME/g, datiUtente.nome)
          .replace(/SEGNO/g, datiUtente.segno);
        return popup;
      });
    res.json(popup);
  }
  //res.json(datiUtente);

  /* eslint-enable no-await-in-loop */
});
