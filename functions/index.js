const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello World!");
});

exports.getScreams = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("screams")
    .get()
    .then(response => {
      let screams = [];
      response.forEach(item => {
        screams.push(item.data());
      });
      return res.json(screams);
    })
    .catch(err => {
      console.log(err);
    });
});

exports.createScreams = functions.https.onRequest((req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then(response =>
      res.json(`document & {document.id} created successfully.`)
    )
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.log(err);
    });
});
