const functions = require("firebase-functions");

const express = require("express");
const app = express();

const FBAuth = require("./util/FBAuth");

const { getAllScreams, postOneScream } = require("./handlers/screams");

const { signup, login, uploadImage } = require("./handlers/users");

// scream routes
app.get("/screams", getAllScreams);
app.post("/screams", FBAuth, postOneScream);

// signup routes
app.post("/signup", signup);
app.post("/login", login);
app.post('/user/image', FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);
