const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

let dbname = 'company';

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {

    // assert.equal(null,err);
    if (err)
        return console.log("error: not connected");

    const db = client.db(dbname);
    console.log("Connected Successfully to Server");
    exports.db = db;
    // console.log(db);
    require('./bin/www');

})