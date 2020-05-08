const functions = require("firebase-functions");

const express = require("express");
const app = express();

const FBAuth = require("./util/FBAuth");

const { getAllScreams, postOneScream } = require("./handlers/screams");

const { signup, login } = require("./handlers/users");

// scream routes
app.get("/screams", getAllScreams);
app.post("/screams", FBAuth, postOneScream);

// signup routes
app.post("/signup", signup);
app.post("/login", login);

exports.api = functions.https.onRequest(app);
