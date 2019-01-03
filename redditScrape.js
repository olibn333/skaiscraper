const cheerio = require('cheerio');
const request = require('request')
const mongoStore = require('./mongoStore')

scrapeInit()

//Error log as object
let errorLog = {
    errorCount: 0
}

//Checks if query returns undefined
function checkUndefined(query) {
    if (query === undefined) {
        errorLog.errorCount += 1
        return "Not found"
    } else {
        return query
    }
}

function scrapeInit() {
  getRedditArticles('https://www.reddit.com/r/futurology')
  console.log('Scraping...')
}

function scrapeResultHandler(result, site, errs) {
  const scrapes = result[site].scrapes
  //Array of timestamps
  const timestamps = Object.keys(scrapes)
  //Use pop() to get last timestamp key from array
  console.log(Object.keys(scrapes[timestamps.pop()]).length + " Articles scraped.")
  console.log(errs + " details not found.")
  console.log(result)
  console.log(result[site].scrapes)

  mongoStore.storeInit(result)
}

//Build objects for scrape result data
function createResultsObject(name, baseUrl) {
  return {
    [name]: {
      'baseUrl': baseUrl,
      scrapes: {
        }
    }
  }
}

function getRedditArticles(url) {
  
  //Connect
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      //Create object to contain articles (db.site.scrapes.timestamp)
      let resultData = createResultsObject('reddit', 'https://www.reddit.com')

      //Create timestamp for scrape session
      const timestampNow = new Date().toISOString()

      //Create empty object with timestamp
      resultData.reddit.scrapes[timestampNow] = {}

      //Scrape details with cheerio
      const $ = cheerio.load(body)
      const articles = $('article')

      articles.each(function (i, element) {

        let titleEl, titleText, commentsUrl, picUrl, articleUrl

        //Title
        titleEl = $('a h2', element)
        titleText = checkUndefined( titleEl.text() )

        //Reddit URL
        commentsUrl = resultData.reddit.baseUrl + checkUndefined( titleEl.parent().attr('href') )

        //Image URL
        try {
          const picEl = $('a div[role=img]', element)
          picUrl = picEl.css('background-image').slice(4, -1)
        }
        catch (e) { 
          picUrl = 'Not Found' 
          errorLog.errorCount += 1
        }

        //Article URL
        articleUrl = checkUndefined( $('div a', element).eq(4).attr('href') )

        //Fill timestamped object with scrape results
        i += 1
        const articleDetails = { i, titleText, commentsUrl, picUrl, articleUrl }
        let currentScrape = resultData.reddit.scrapes[timestampNow]
        currentScrape[i] = Object.assign({}, articleDetails)
      })
      //callback
      scrapeResultHandler(resultData, 'reddit', errorLog.errorCount)
    }
  })
}