const uuid = require('uuid/v1');
const parseUrl = require('./parseUrl')


//Creates the 'shell' for scrape results object
function createScrapeResultsObject(url) {

  const scrapeId = uuid()
  const scrapeTimestamp = new Date()
  const urlDetails = parseUrl.extractUrlDetails(url)
  const articlesArray = []
  //Record Scrape Errors
  const errorLog = {
    errorCount: 0
  }
  const scrapeResultsObject = Object.assign({ scrapeId, scrapeTimestamp, articlesArray, errorLog }, urlDetails)

  return scrapeResultsObject
}

module.exports = { createScrapeResultsObject }