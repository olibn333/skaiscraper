const uuid = require('uuid/v1');
const parseUrl = require('./parseUrl')
const websiteLogo = require('website-logo')

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

class errorLog {
  constructor() {
    this.errorCount = 0
  }
  checkUndefined(query) {
    if (query === undefined) {
      this.errorCount += 1
      return "Not Found"
    } else if (typeof query === 'string') {
      return query.replace(/\s+/g,' ').trim()
    } else {
      return query
    }
  }
}

module.exports = { createScrapeResultsObject, websiteLogo, errorLog }