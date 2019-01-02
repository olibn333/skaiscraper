const readline = require('readline');

//storeInit('a')

function storeInit(file) {
  sendToDB(file)
}

function sendToDB(file) {
  let uname, pword
  promptUserNameandPassword(printResult)
}

function printResult(a,b) {
  console.log("Got " + a + " and " + b)
}

function promptUserNameandPassword(callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('MongoDB Username:', (answer) => {
    rl.question('MongoDB Password:', (answer2) => {
      callback(answer,answer2)
    rl.close();
    })
    
  });
};

function sendToMongoDB(username, password, file) {
  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb+srv://" + username + ":" + password + "@cluster0-ywxua.mongodb.net/test?retryWrites=true";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Database Connected!");
    db.close();
  });
}

module.exports = { storeInit }