const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const app = express();

app.get("/screams", (req, res) => {
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
  if (req.method != "POST") {
    return res.status(400).json({ error: "Method not allowed" });
  }
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

exports.api = functions.https.onRequest(app);
