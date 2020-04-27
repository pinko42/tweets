const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const app = express();

const config = {
  apiKey: "AIzaSyCKMPkl-nFYVjdpxx2xdTpMqsvyYoUyS_U",
  authDomain: "socialapp-cd82a.firebaseapp.com",
  databaseURL: "https://socialapp-cd82a.firebaseio.com",
  projectId: "socialapp-cd82a",
  storageBucket: "socialapp-cd82a.appspot.com",
  messagingSenderId: "293864278904",
  appId: "1:293864278904:web:44a026eed3c83a70fed68d",
  measurementId: "G-NJK2N6X81H",
};

const firebase = require("firebase");
firebase.initializeApp(config);

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push(doc.data());
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

app.post("/screams", (req, res) => {
  const newscream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };

  admin
    .firestore()
    .collection("screams")
    .add(newscream)
    .then((doc) => {
      res.json({ message: `doc ${doc.id}success` });
    })
    .catch((err) => {
      res.status(500).json({ error: "somthing went wrong" });
      console.error(err);
    });
});
//sup 7777

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      return res
        .status(201)
        .json({ message: `user ${data.user.uid} signed up sucssefully` });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

exports.api = functions.https.onRequest(app);
