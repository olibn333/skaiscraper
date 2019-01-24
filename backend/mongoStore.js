const readline = require('readline');
const MongoClient = require('mongodb').MongoClient;

process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled promise rejection:', promise, 'reason:', reason.stack || reason);
});

async function constructMongoUrl() {
  try {
    const creds = require('../skai-config')
    uname = creds.username
    pword = creds.password
  }
  catch (e) {
    console.log("No local config file found. Please enter username and password:")
    const creds = await promptUserNameandPassword()
    uname = creds.username
    pword = creds.password
  }
  const url = "mongodb+srv://" + uname + ":" + pword + "@cluster0-ywxua.mongodb.net/test?readPreference=secondary";
  //const url = "mongodb://"+uname+":"+pword+"@cluster0-shard-00-00-ywxua.mongodb.net:27017,cluster0-shard-00-01-ywxua.mongodb.net:27017,cluster0-shard-00-02-ywxua.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
  return url
}


async function setProfiling() {
    const url = await constructMongoUrl()
    return MongoClient.connect(url, { useNewUrlParser: true, forceServerObjectId: true })
      .then(client => {
        client.db('test').setProfilingLevel('all')
        .then(client.close())
        .catch(e =>console.log(e))
      })
    .catch(e => console.log(e))  //skaiScraper-referenced
  }

async function readProfiler() {
  const url = await constructMongoUrl()
  MongoClient.connect(url, { useNewUrlParser: true, forceServerObjectId: true })
    .then(client => {
        client.db('system').collection('profile').findOne({})
        .then(data => {
          console.log(data)
        })
        .catch(e => console.log(e))
        .then(client.close())
      })
    .catch(e => console.log(e))
    //console.log(level)
} 

readProfiler()


function sendToDB(file) {
  try {
    const creds = require('../skai-config')
    uname = creds.username
    pword = creds.password
    sendToMongoDB(uname, pword, file)
  }
  catch (e) {
    console.log("No local config file found. Please enter username and password:")
    promptUserNameandPassword(handleResult)
  }
}

function handleResult(uname, pword, file) {
  sendToMongoDB(uname, pword, file)
}

function promptUserNameandPassword() {
  const credsPromise = new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('MongoDB Username: ', (uname) => {
      rl.question('MongoDB Password: ', (pword) => {
        resolve({ uname, pword })
        rl.close();
      })
    });
  }).catch((err) => console.log("WTF -- " + err))

  return credsPromise
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
          if (i == articlesArray.length - 1) {
            updateCounts(res.upsertedCount, res.modifiedCount)
            console.log("Updated " + updatedDocs + ", Inserted " + newDocs + " document(s) to articles collection.")
          }
          else { updateCounts(res.upsertedCount, res.modifiedCount) }
        }
      )
    })
    db.close()
  })
}


module.exports = { sendToDB }