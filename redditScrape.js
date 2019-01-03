const cheerio = require('cheerio');
const request = require('request')
const mongoStore = require('./mongoStore')

//Create timestamp to create object + make scrape accessible
const timestampNow = new Date().toISOString()

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

function scrapeResultHandler(result, errs) {
  console.log(Object.keys(result.reddit.scrapes[timestampNow].articles).length + " Articles scraped.")
  console.log(errs + " details not found.")
  console.log(result)
  console.log(result.reddit.scrapes)

  mongoStore.storeInit(result)
}

//Build objects for scrape result data
function createResultsObject(name, baseUrl, timestamp) {
  return {
    [name]: {
      'baseUrl': baseUrl,
      scrapes: {
        [timestamp]: {
          articles: {

          }
        }
      }
    }
  }
}

function getRedditArticles(url) {
  
  //Connect
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      //Create object to contain articles (db.site.scrapes.timestamp.articles)
      let resultData = createResultsObject('reddit', 'https://www.reddit.com', timestampNow)

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

        //
        const articleDetails = { i, titleText, commentsUrl, picUrl, articleUrl }        
        resultData.reddit.scrapes[timestampNow].articles[i] = articleDetails
        
      })
      //callback
      scrapeResultHandler(resultData, errorLog.errorCount)
    }
  })
}