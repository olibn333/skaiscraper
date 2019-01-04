const readline = require('readline');

//storeInit('a')

function storeInit(file) {
  sendToDB(file)
}

function sendToDB(file) {
  promptUserNameandPassword(file, handleResult)
}

function handleResult(uname,pword,file) {
  // console.log("Got " + a + " and " + b)
  // console.log("Data: " + file.length + " articles")
  sendToMongoDB(uname,pword,file)
}

function promptUserNameandPassword(file, callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('MongoDB Username: ', (uname) => {
    rl.question('MongoDB Password: ', (pword) => {
      callback(uname,pword, file)
    rl.close();
    })
    
  });
};

function sendToMongoDB(username, password, file) {
  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://" + username + ":" + password + "@cluster0-ywxua.mongodb.net/test?retryWrites=true";

  MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    console.log("Database Connected! Ready to send " + file.length + " articles");
    const dbo = db.db('skaiScraper')
    const scraperCollection = dbo.collection('sites')
    scraperCollection.insertOne(file)
    db.close();
  });
}

module.exports = { storeInit }