const readline = require('readline');
const MongoClient = require('mongodb').MongoClient;


function sendToDB(file) {
  try {
    const creds = require('../skai-config')
    uname = creds.username
    pword = creds.password
    sendToMongoDB(uname, pword, file)
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

let newDocs = 0
let updatedDocs = 0
function updateCounts(newDs, updatedDs) {
  newDocs = newDocs + newDs;
  updatedDocs = updatedDocs + updatedDs
}


function sendToMongoDB(username, password, file) {
  const url = "mongodb+srv://" + username + ":" + password + "@cluster0-ywxua.mongodb.net/test?retryWrites=true";

  //Arrticles Array
  const articlesArray = file.articlesArray
  const articleUrlsFilter = articlesArray.map(a => a.articleUrl).join()

  //Scrape Object
  const scrapeObject = Object.assign(file, {})
  delete scrapeObject.articlesArray

  //Insert Scrape Obj, Upsert articles
  MongoClient.connect(url, { useNewUrlParser: true, forceServerObjectId: true }, function (err, db) {
    if (err) throw err
    console.log("Database Connected!")
    const dbo = db.db('testing') //skaiScraper-referenced

    // return new Promise(async function (resolve, reject) {
    //   let taskComplete = 0

    //Insert Scrape Object
    dbo.collection('scrapes').insertOne(scrapeObject, function (error, res) {
      if (error) throw error
      console.log("Inserted " + res.ops.length + " document(s) to scrapes collection.")
    })

    // //Insert Articles Array
    // dbo.collection('articlesTest').insertMany(articlesArray, function (err, res) {
    //   // if (err) throw err
    //   console.log("Inserted " + res.ops.length + " document(s) to articles collection.")
    // })

    //Upsert Articles Array
    articlesArray.forEach((article, i) => {

      dbo.collection('articlesTest').updateOne(
        { articleUrl: article.articleUrl },
        { $set: article },
        { upsert: true },
        function (err, res) {
          // if (err) throw err
          if (i == articlesArray.length-1) {
            updateCounts(res.upsertedCount, res.modifiedCount)
            console.log("Updated " + updatedDocs + ", inserted " + newDocs + " document(s) to articles collection.")
          }
          else { updateCounts(res.upsertedCount, res.modifiedCount) }
        }
      )
    })
    db.close()
  })
}

module.exports = { sendToDB }