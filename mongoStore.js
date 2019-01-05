const readline = require('readline');
const MongoClient = require('mongodb').MongoClient;


function sendToDB(file) {
  promptUserNameandPassword(file, handleResult)
}

function handleResult(uname,pword,file) {
  sendToMongoDB(uname,pword,file)
}

function promptUserNameandPassword(file, callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('MongoDB Username: ', (uname) => {
    rl.question('MongoDB Password: ', (pword) => {
      callback(uname, pword, file)
    rl.close();
    })
    
  });
};

function sendToMongoDB(username, password, file) {
  const url = "mongodb+srv://" + username + ":" + password + "@cluster0-ywxua.mongodb.net/test?retryWrites=true";

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    console.log("Database Connected! Sending " + file.articlesArray.length + " articles");
    const dbo = db.db('skaiScraper')
    const scraperCollection = dbo.collection('sites')
    scraperCollection.insertOne(file, function(err, res) {
      if (err) throw err;
      console.log("Inserted " + res.ops.length + " document(s).")
    })
    db.close();
  });
}

module.exports = { sendToDB }