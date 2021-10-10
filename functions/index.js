const functions = require("firebase-functions");
const moment = require("moment");
const admin = require("firebase-admin");
const { Expo } = require("expo-server-sdk");
const { firebaseConfig } = require("firebase-functions");
const FieldValue = require("firebase-admin").firestore.FieldValue;
admin.initializeApp();
let expo = new Expo();

exports.oroscopoGiornaliero = functions
  .runWith({ memory: "1GB", timeoutSeconds: 540 })
  .https.onRequest(async (req, res) => {
    let messages = [];
    await admin
      .firestore()
      .collection("Utenti")
      .where("notificationToken", ">", "")
      .get()
      .then((response) =>
        response.forEach((doc) => {
          if (
            moment(doc.data().ultimoAccesso).isBefore(
              moment().startOf("day")
            ) &&
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
              channelId: "Giornaliero",
            });
          }
        })
      );
    // MANDO LE NOTIFICHE

    let chunks = expo.chunkPushNotifications(messages);
    let daCancellare = [];
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

          for (
            let ticketIndex = 0;
            ticketIndex < ticketChunk.length;
            ticketIndex++
          ) {
            if (ticketChunk[ticketIndex].status === "error") {
              if (
                ticketChunk[ticketIndex].details.error === "DeviceNotRegistered"
              )
                daCancellare.push(chunk[ticketIndex].to);
            }
          }

          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
        } catch (error) {
          console.error(error);
        }
      }

      await admin
        .firestore()
        .collection("TokenDaCancellare")
        .doc("ListaAttuale")
        .set({ arrayToken: daCancellare });

      res.json(true);
      /* eslint-enable no-await-in-loop */
    })();
  });

exports.oroscopoSettimanale = functions
  .runWith({ memory: "1GB",  timeoutSeconds: 540 })
  .https.onRequest(async (req, res) => {
    let messages = [];
    await admin
      .firestore()
      .collection("Utenti")
      .where("notificationToken", ">", "")
      .get()
      .then((response) =>
        response.forEach((doc) => {
          if (Expo.isExpoPushToken(doc.data().notificationToken)) {
            messages.push({
              to: doc.data().notificationToken,
              sound: "default",
              body:
                "Ehi " +
                doc.data().nome +
                ", scopri il nuovo oroscopo settimanale! Cosa ti aspetterà la prossima settimana? 🤨",
              data: { tipologia: "settimanale" },
              channelId: "Settimanale",
            });
          }
        })
      );
    // MANDO LE NOTIFICHE

    let chunks = expo.chunkPushNotifications(messages);
    let daCancellare = [];
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

          for (
            let ticketIndex = 0;
            ticketIndex < ticketChunk.length;
            ticketIndex++
          ) {
            if (ticketChunk[ticketIndex].status === "error") {
              if (
                ticketChunk[ticketIndex].details.error === "DeviceNotRegistered"
              )
                daCancellare.push(chunk[ticketIndex].to);
            }
          }
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
        } catch (error) {
          console.error(error);
        }
      }

      await admin
        .firestore()
        .collection("TokenDaCancellare")
        .doc("ListaAttuale")
        .set({ arrayToken: daCancellare });

      res.json(true);
      /* eslint-enable no-await-in-loop */
    })();
  });

exports.oroscopoMensile = functions
  .runWith({ memory: "1GB", timeoutSeconds: 540 })
  .https.onRequest(async (req, res) => {
    let messages = [];
    await admin
      .firestore()
      .collection("Utenti")
      .where("notificationToken", ">", "")
      .get()
      .then((response) =>
        response.forEach((doc) => {
          if (Expo.isExpoPushToken(doc.data().notificationToken)) {
            messages.push({
              to: doc.data().notificationToken,
              sound: "default",
              body:
                "Ciao " +
                doc.data().nome +
                "! Non hai ancora letto il tuo oroscopo di questo mese, che aspetti? ⏳",
              data: { tipologia: "mensile" },
              channelId: "Mensile",
            });
          }
        })
      );
    // MANDO LE NOTIFICHE

    let chunks = expo.chunkPushNotifications(messages);
    let daCancellare = [];
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

          for (
            let ticketIndex = 0;
            ticketIndex < ticketChunk.length;
            ticketIndex++
          ) {
            if (ticketChunk[ticketIndex].status === "error") {
              if (
                ticketChunk[ticketIndex].details.error === "DeviceNotRegistered"
              )
                daCancellare.push(chunk[ticketIndex].to);
            }
          }
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
        } catch (error) {
          console.error(error);
        }
      }
      await admin
        .firestore()
        .collection("TokenDaCancellare")
        .doc("ListaAttuale")
        .set({ arrayToken: daCancellare });

      res.json(tickets);
      /* eslint-enable no-await-in-loop */
    })();
  });

exports.nuovaRubrica = functions
  .runWith({ memory: "1GB", timeoutSeconds: 540 })
  .https.onRequest(async (req, res) => {
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
      .then((response) =>
        response.forEach((doc) => {
          if (Expo.isExpoPushToken(doc.data().notificationToken)) {
            messages.push({
              to: doc.data().notificationToken,
              sound: "default",
              body: titolo,
              data: { tipologia: "rubrica", slug: slug },
              channelId: "Rubrica",
            });
          }
        })
      );
    // MANDO LE NOTIFICHE

    let chunks = expo.chunkPushNotifications(messages);
    let daCancellare = [];
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

          for (
            let ticketIndex = 0;
            ticketIndex < ticketChunk.length;
            ticketIndex++
          ) {
            if (ticketChunk[ticketIndex].status === "error") {
              if (
                ticketChunk[ticketIndex].details.error === "DeviceNotRegistered"
              )
                daCancellare.push(chunk[ticketIndex].to);
            }
          }
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
        } catch (error) {
          console.error(error);
        }
      }
      await admin
        .firestore()
        .collection("TokenDaCancellare")
        .doc("ListaAttuale")
        .set({ arrayToken: daCancellare });

      res.json(true);
      /* eslint-enable no-await-in-loop */
    })();
  });

exports.biscottoDellaFortuna = functions
  .runWith({ memory: "1GB", timeoutSeconds: 540 })
  .https.onRequest(async (req, res) => {
    let messages = [];
    await admin
      .firestore()
      .collection("Utenti")
      .where("notificationToken", ">", "")
      .get()
      .then((response) =>
        response.forEach((doc) => {
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
              channelId: "Biscotto",
            });
          }
        })
      );

    // MANDO LE NOTIFICHE
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    let daCancellare = [];
    (async () => {
      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      /* eslint-disable no-await-in-loop */
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          //console.log(chunk);
          console.log(ticketChunk);
          for (
            let ticketIndex = 0;
            ticketIndex < ticketChunk.length;
            ticketIndex++
          ) {
            if (ticketChunk[ticketIndex].status === "error") {
              if (
                ticketChunk[ticketIndex].details.error === "DeviceNotRegistered"
              )
                daCancellare.push(chunk[ticketIndex].to);
            }
          }
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
        } catch (error) {
          console.error(error);
        }
      }
      //Salvo su firebase la lista dei token da cancellare
      await admin
        .firestore()
        .collection("TokenDaCancellare")
        .doc("ListaAttuale")
        .set({ arrayToken: daCancellare });

      res.json(true);
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
    .then((response) => {
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
        "https://www.oetker.co.uk/Recipe/Recipes/oetker.co.uk/uk-en/baking/image-thumb__3337__RecipeDetailsLightBox/sprinkles-birthday-cake.jpg",
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
      .then((response) => {
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

exports.correggiSegno = functions.https.onRequest(async (req, res) => {
  const dateSegni = [
    {
      Acquario: {
        in: "20-01",
        out: "19-02",
      },
    },
    {
      Ariete: {
        in: "21-03",
        out: "19-04",
      },
    },
    {
      Bilancia: {
        in: "23-09",
        out: "22-10",
      },
    },
    {
      Cancro: {
        in: "21-06",
        out: "22-07",
      },
    },
    {
      Capricorno: {
        in: "22-12",
        out: "19-01",
      },
    },
    {
      Gemelli: {
        in: "21-05",
        out: "20-06",
      },
    },
    {
      Leone: {
        in: "23-07",
        out: "23-08",
      },
    },
    {
      Pesci: {
        in: "20-02",
        out: "20-03",
      },
    },
    {
      Sagittario: {
        in: "22-11",
        out: "21-12",
      },
    },
    {
      Scorpione: {
        in: "23-10",
        out: "21-11",
      },
    },
    {
      Toro: {
        in: "20-04",
        out: "20-05",
      },
    },
    {
      Vergine: {
        in: "24-08",
        out: "22-09",
      },
    },
  ];
  let errati = [];
  await admin
    .firestore()
    .collection("Utenti")
    .where("segno", "==", null)
    .get()
    .then((response) =>
      response.forEach((doc) => {
        let segno;
        let arrayData = doc.data().dataDiNascita.split("/");
        for (element in dateSegni) {
          const inn = Object.values(dateSegni[element])[0].in.split("-");
          const out = Object.values(dateSegni[element])[0].out.split("-");
          if (
            (arrayData[1] === inn[1] && arrayData[0] >= inn[0]) ||
            (arrayData[1] === out[1] && arrayData[0] <= out[0])
          ) {
            segno = Object.keys(dateSegni[element])[0];
          }
        }
        errati.push({ id: doc.id, data: doc.data().dataDiNascita, segno });
      })
    );
  let output = [];
  /* eslint-disable no-await-in-loop */
  for (element in errati) {
    //output.push(errati[element]);
    await admin
      .firestore()
      .collection("Utenti")
      .doc(errati[element].id)
      .update({ segno: errati[element].segno });
  }
  res.json(errati);
  /* eslint-enable no-await-in-loop */
});

exports.contaEmailVuote = functions.https.onRequest(async (req, res) => {
  let utentiVuoti = [];
  await admin
    .firestore()
    .collection("Utenti")
    .where("email", "==", "")
    .get()
    .then((response) =>
      response.forEach((doc) => {
        utentiVuoti.push(doc.data());
      })
    );

  res.json(utentiVuoti);
  /* eslint-enable no-await-in-loop */
});

exports.deleteOldMessages = functions
  .runWith({ memory: "1GB", timeoutSeconds: 540 })
  .https.onRequest(async (req, res) => {
    var earlierThan = new Date();
    earlierThan.setTime(earlierThan.getTime() - 1 * 60 * 60 * 1000);

    let cancellati = [];
    await admin
      .firestore()
      .collection("Messages")
      .get()
      .then((snapshot) => {
        console.warn("snapshot size: " + snapshot.size);

        // When there are no documents left, we are done
        if (snapshot.size === 0) {
          return 0;
        }

        // Delete documents in a batch
        snapshot.docs.forEach((doc) => {
          //console.warn("considering: " + doc.id);
          if (doc.createTime.toDate().getTime() <= earlierThan.getTime()) {
            //console.warn("to delete: " + doc.id);
            //batch.delete(doc.ref);
            cancellati.push({
              //ref: doc.ref,
              mex: doc.data().createdAt,
            });
            doc.ref.delete();
          }
        });

        return cancellati;
        //return batch.commit();
      })
      .then((result) => {
        // console.warn("deleted: " + result.size);
        return result.size;
      })
      .catch((error) => {
        console.error(error);
      });

    res.json({ cancellati });
  });

exports.cancellaTokenInutilizzabili = functions
  .runWith({ memory: "1GB", timeoutSeconds: 540 })
  .https.onRequest(async (req, res) => {
    let listaToken = [];
    await admin
      .firestore()
      .collection("TokenDaCancellare")
      .doc("ListaAttuale")
      .get()
      .then((response) => (listaToken = response.data().arrayToken));

    let utenti = [];
    /* eslint-disable no-await-in-loop */
    /* eslint-disable no-loop-func */

    for (let token of listaToken) {
      try {
        let idDaModificare;
        await admin
          .firestore()
          .collection("Utenti")
          .where("notificationToken", "==", token)
          .get()
          .then((response) =>
            response.forEach((doc) => {
              utenti.push(doc.data());
              idDaModificare = doc.id;
            })
          );
        await admin
          .firestore()
          .collection("Utenti")
          .doc(idDaModificare)
          .update({ notificationToken: null });

        await admin
          .firestore()
          .collection("TokenDaCancellare")
          .doc("ListaAttuale")
          .update({
            arrayToken: FieldValue.arrayRemove(token),
          });
      } catch (error) {
        console.error(error);
      }
    }

    res.json(true);
    /* eslint-enable no-loop-func */
    /* eslint-enable no-await-in-loop */
  });
