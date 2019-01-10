const mongoStore = require('./mongoStore')

function scrapeResultHandler(scrapeResultsObject, globalErrorLog) {

  console.log(scrapeResultsObject.articlesArray.length + " Articles scraped.")
  console.log(globalErrorLog.errorCount + " Details not found.")
  //console.log(scrapeResultsObject)

  mongoStore.sendToDB(scrapeResultsObject)
}

module.exports = scrapeResultHandler