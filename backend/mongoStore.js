const readline = require('readline');
const MongoClient = require('mongodb').MongoClient;


async function sendToDB(file) {
  try {
    const creds = require('../skai-config')
    uname = creds.username
    pword = creds.password
    await sendToMongoDB(uname, pword, file)
  }
  catch (e) {
    console.log("No local config file found. Please enter username and password:")
    promptUserNameandPassword(file, handleResult)
  }
}

function handleResult(uname, pword, file) {
  sendToMongoDB(uname, pword, file)
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

  //Arrticles Array
  const articlesArray = file.articlesArray
  //Scrape Object
  const scrapeObject = Object.assign(file, {})
  delete scrapeObject.articlesArray


  MongoClient.connect(url, { useNewUrlParser: true, forceServerObjectId: true }, function (err, db) {
    if (err) throw err
    console.log("Database Connected!")
    const dbo = db.db('skaiScraper-referenced2')

    return new Promise(function (resolve, reject) {
      //Insert Scrape Object
      dbo.collection('scrapes').insertOne(scrapeObject, function (err, res) {
        if (err) throw err
        console.log("Inserted " + res.ops.length + " document(s) to scrapes collection.")
      })

      //Insert Articles Array
      dbo.collection('articles').insertMany(articlesArray, function (err, res) {
        if (err) throw err
        console.log("Inserted " + res.ops.length + " document(s) to articles collection.")
      })
      resolve(db.close())
    })
  });
}

module.exports = { sendToDB }