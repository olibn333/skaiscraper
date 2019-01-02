const readline = require('readline');


function storeInit(){
  waitforPassword()
}

function handleAnswer(answer) {
  console.log("Your password is " + answer + "?")
}

function waitforPassword() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('MongoDB Password:', (answer) => {
    handleAnswer(answer)
    rl.close();
  });
};


// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb+srv://<USERNAME>:<PASSWORD>@cluster0-ywxua.mongodb.net/test?retryWrites=true";

// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   console.log("Database Connected!");
//   db.close();
// });

module.exports = {storeInit}