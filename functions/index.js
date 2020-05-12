const functions = require("firebase-functions");

const express = require("express");
const app = express();

const FBAuth = require("./util/FBAuth");

const { getAllScreams, postOneScream, getScream, commentOnScream } = require("./handlers/screams");

const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/users");

// scream routes
app.get("/screams", getAllScreams);
app.post("/screams", FBAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);

// signup routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
