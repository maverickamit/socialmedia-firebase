const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
admin.initializeApp();
const app = express();

const config = {
  apiKey: "AIzaSyC4DzcXiZmbv6OtsCX3boPBd2YDRFzzoIA",
  authDomain: "socialmedia-1638a.firebaseapp.com",
  databaseURL: "https://socialmedia-1638a.firebaseio.com",
  projectId: "socialmedia-1638a",
  storageBucket: "socialmedia-1638a.appspot.com",
  messagingSenderId: "441693890335",
  appId: "1:441693890335:web:de3c06ca422ac282bff22a",
  measurementId: "G-FENVX6D0QN"
};

const firebase = require("firebase");
firebase.initializeApp(config);

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(response => {
      let screams = [];
      response.forEach(item => {
        screams.push({
          screamId: item.id,
          body: item.data().body,
          userHandle: item.data().userHandle,
          createdAt: item.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

exports.api = functions.region("asia-south1").https.onRequest(app);
