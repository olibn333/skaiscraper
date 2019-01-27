const MongoClient = require('mongodb').MongoClient;
const constructMongoUrl = require('./mongoStore').constructMongoUrl

const listener = require('mongodb').instrument({
  operationIdGenerator: {
    operationId: 1,

    next: function() {
      return this.operationId++;
    }
  },

  timestampGenerator: {
    current: function() {
      return new Date().getTime();
    },

    duration: function(start, end) {
      return end - start;
    }
  }  
}, function(err, instrumentations) {
  // Instrument the driver  
});

listener.on('started', function(event) {
  // command start event (see https://github.com/mongodb/specifications/blob/master/source/command-monitoring/command-monitoring.rst)
});

listener.on('succeeded', function(event) {
  // command success event (see https://github.com/mongodb/specifications/blob/master/source/command-monitoring/command-monitoring.rst)
});

listener.on('failed', function(event) {
  // command failure event (see https://github.com/mongodb/specifications/blob/master/source/command-monitoring/command-monitoring.rst)
});

async function setProfiling() {
  const url = await constructMongoUrl()
  const mongo = MongoClient.connect(url, { useNewUrlParser: true, forceServerObjectId: true })
  const db = mongo.then(client => {
      return client.db('test')
    })
  db.then(db => {
    return db.setProfilingLevel('all').then(a=>console.log(a)).catch(e=>console.log(e))
  })
  db.then(db => {
    return db.collection('test2').insertOne({'test':'test2'}).then(a=>console.log(a)).catch(e=>console.log(e))
  })
  .then(close())
}

async function readProfiler() {
const url = await constructMongoUrl()
const mongo = MongoClient.connect(url, { useNewUrlParser: true, forceServerObjectId: true })
  .then(client => {
    const db = client.db('system')
    const col = db.collection('profile')
    const res = col.findOne({}).then(data => console.log(data)).catch(e => console.log(e))
    console.log(res)
      // .then(data => {
      //   //const res1 = data.findOne({})
      //   console.log(data)
      // }
      // )
      // // .then(client.close())
      // .catch(e => console.log(e))
  })
  .catch(e => console.log(e))
//console.log(level)
}

async function testInsert(){
  const url = await constructMongoUrl()
  const beginTime = new Date()
  MongoClient.connect(url, { useNewUrlParser: true, forceServerObjectId: true })
    .then(client => {
      return client.db('test').collection('test2')
        .insertOne({'test':'test2'})
        .then(a=>console.log(a))
        .then(() => client.close())
        .catch(e=>console.log(e))
        .then(() => {
          const endTime = new Date()
          const timeDiff = endTime-beginTime
          return console.log("Executed in " +timeDiff +"ms")
        })
    })
}

testInsert()
