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

const db = admin.firestore();

app.get("/screams", (req, res) => {
  db.collection("screams")
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

  db.collection("screams")
    .add(newscream)
    .then((doc) => {
      res.json({ message: `doc ${doc.id}success` });
    })
    .catch((err) => {
      res.status(500).json({ error: "somthing went wrong" });
      console.error(err);
    });
});

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else false;
};

const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = "email should not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "must be a valid email address";
  }
  if (isEmpty(newUser.password)) errors.password = " must not be empty";
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = "password not the same";
  if (isEmpty(newUser.handle)) errors.handle = " must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: "handle alredy taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  let errors = {};
  if (isEmpty(user.email)) errors.email = "must not be empty";
  if (isEmpty(user.password)) errors.password = "must not be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res.status(403).json({ general: "wrong password try again" });
      } else return res.status(500).json({ error: err.code });
    });
});

exports.api = functions.https.onRequest(app);
