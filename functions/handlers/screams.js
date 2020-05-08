const { db } = require("../util/admin");

exports.getAllScreams = (req, res) => {
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
};

exports.postOneScream = (req, res) => {
  const newscream = {
    body: req.body.body,
    userHandle: req.user.handle,
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
};
