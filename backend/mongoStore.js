const readline = require('readline');
const MongoClient = require('mongodb').MongoClient;

async function constructMongoUrl() {
  try {
    const creds = require('./skai-config')
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

async function sendToMongoDB3(file){

  const mongoCollection = 'testing2'

  //Articles Array
  const articlesArray = file.articlesArray
  //Scrape Object
  const scrapeObject = Object.assign(file, {})
  delete scrapeObject.articlesArray

  const url = await constructMongoUrl()
  const beginTime = new Date()

  const bulkUpdateObj = articlesArray.map((article, i) => {
    const upD =
    {
      "updateOne":
      {
        "filter": { articleUrl: article.articleUrl },
        "update": { $set: article },
        "upsert": true
      }
    }
    return upD
  })

  try {
    console.log("Connecting to database...")
    MongoClient.connect(url,{ useNewUrlParser: true, forceServerObjectId: true }, function(err,db){
      if (!err){
        let dbo = db.db(mongoCollection)
        //Insert Scrape Obj
        dbo.collection('scrapes').insertOne(scrapeObject,function(err,result){
          if (!err){
          //Process Scrape Insert Result
          console.log("Inserted " + result.result.n + " scrape object to scrapes collection.")
          //Insert Articles
          dbo.collection('articles').bulkWrite(bulkUpdateObj, { ordered: false },function(err,result){
          if (!err){
            //Process Articles Write Result
            console.log("Updated " + result.matchedCount + ", Created " + result.upsertedCount + " articles.")
            const endTime = new Date()
            const timeDiff = endTime - beginTime
            console.log("DB Work took " + timeDiff + "ms")
            db.close()
            } else {console.log(err)}
          })} else {console.log(err)}
      })} else { console.log(err)}
    })
  } catch (e) {
    return console.log(e)
  }
  return "Connected."
}

async function asyncSendToMongoDB2(file) {

  const mongoCollection = 'testing2'

  //Articles Array
  const articlesArray = file.articlesArray
  //Scrape Object
  const scrapeObject = Object.assign(file, {})
  delete scrapeObject.articlesArray

  const url = await constructMongoUrl()
  const beginTime = new Date()

  const bulkUpdateObj = articlesArray.map((article, i) => {
    const upD =
    {
      "updateOne":
      {
        "filter": { articleUrl: article.articleUrl },
        "update": { $set: article },
        "upsert": true
      }
    }
    return upD
  })

  let scrapeRes
  let articlesRes

  const timeOut = new Promise(function(resolve, reject) {
    setTimeout(() => resolve('Timeout'), 10000)
  })

  try {
    console.log("Connecting to database...")
    let client = await Promise.race([timeOut, MongoClient.connect(url, { useNewUrlParser: true, forceServerObjectId: true }).catch(e => console.log("Connection Failed", e))])
    console.log("Result of Promise.race(): ", client)

    let dbo = client.db(mongoCollection)

    scrapeRes = await dbo.collection('scrapes').insertOne(scrapeObject)
    articlesRes = await dbo.collection('articles').bulkWrite(bulkUpdateObj, { ordered: false })
    console.log("Completed database work.")
    client.close()
  } catch (e) {
    console.log(e)
  }

  const endTime = new Date()
  const timeDiff = endTime - beginTime
  // const scrapeInsertCount = scrapeRes.result.n
  // const articlesInsertCount = articlesRes.upsertedCount
  // const articlesUpdateCount = articlesRes.matchedCount

  return ({ scrapeRes, articlesRes, timeDiff })

}

module.exports = { constructMongoUrl, asyncSendToMongoDB2, sendToMongoDB3}