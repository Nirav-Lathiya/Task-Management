var express = require("express");
const moment = require("moment");
var router = express.Router();
var { ObjectId } = require("mongodb").ObjectID;
/* GET home page. */
const { db } = require("../db");

var {
  addTaskEvent,
  updateTaskEvent,
  DeleteTask,
  editTask,
} = require("../socketio");

router.get("/", (req, res, next) => {
  res.render("index", {
    title1: "TODO List",
  });
  // console.log("this the home page");
});

router.post("/tasks/add", (req, res, next) => {
  try {
    console.log("body", req.body);
    let date1 = moment().format("MMMM Do YYYY, h:mm:ss a");
    var items = {
      title1: req.body.title,
      status: "new",
      date1: date1,
    };

    db.collection("employee")
      .insertOne({ ...items })
      .then((result) => {
        // console.log("actual", result);
        res.status(200);
        res.json({ id: result.insertedId, date1: date1 });
        // console.log("all items", items);
        items["id"] = result.insertedId;
        addTaskEvent(items);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(503);
      });
  } catch (e) {
    console.log(e);
  }
});

router.get("/tasks/getdata", (req, res, next) => {
  try {
    db.collection("employee")
      .find({})
      .toArray((err, employes) => {
        if (err) {
          return res.sendStatus(503);
        }
        console.table(employes);
        return res.json(employes);
      });
  } catch (e) {
    console.log(e);
  }
});
router.post("/tasks/update", (req, res, next) => {
  try {
    var id = req.body.id;
    var status = req.body.status;
    // console.log(`id ${id}`);
    // console.log(`status ${id}`);
    let dataToInsert = {};
    if (status) {
      dataToInsert["status"] = status;
    }
    dataToInsert["date1"] = moment(new Date()).format(
      "MMMM Do YYYY, h:mm:ss a"
    );
    //  dataToInsert["id"] = id;
    console.log("dataToInsert");
    console.log(dataToInsert);

    db.collection("employee")
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: dataToInsert,
        }
      )
      .then((result) => {
        console.log(result.result);
        db.collection("employee")
          .find({ _id: new ObjectId(id) })
          .toArray()
          .then(([data]) => {
            console.log(data);
            console.log("dating", data);
            res.json(data);
            updateTaskEvent(data);
          });
      })
      .catch((err) => {
        console.log(err);
        return res.sendStatus(503);
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/tasks/edit", (req, res, next) => {
  try {
    var id = req.body.id;
    var title = req.body.title;

    console.log(`idddd ${id}`);
    console.log(title);

    db.collection("employee")
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            title1: title,
            date1: moment(new Date()).format("MMMM Do YYYY, h:mm:ss a"),
          },
        }
      )
      .then((result) => {
        console.log(result.result);
        // TO DO
        editTask({ title, id });
        res.json({ id, title });
      })
      .catch((err) => {
        console.log(err);
        return res.sendStatus(503);
      });
  } catch (e) {
    console.log(e);
  }
});

router.post("/tasks/delete", (req, res, next) => {
  var id = req.body.id;

  db.collection("employee")
    .deleteOne({ _id: ObjectId(id) })
    .then((result) => {
      console.log(result.result);
      DeleteTask({ id });
      return res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(503);
    });
});

module.exports = router;
