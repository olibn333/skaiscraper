const cheerio = require('cheerio');
const request = require('request')
const uuid = require('uuid/v1');
const scrapeResultHandler = require('./scrapeResultHandler')
const parseUrl = require('./parseUrl')

scrapeInit()

let globalErrorLog = {
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
  const url = 'https://www.reddit.com/r/futurology'
  getRedditArticlesFromSubreddit(url)
  console.log('Scraping ' + url + '...')
}

function createScrapeResultsObject(url, errorLog, articlesArray, scrapeId) {

  const scrapeTimestamp = new Date()
  const domainName = parseUrl.extractRootDomain(url)
  const hostName = parseUrl.extractHostname(url)
  const siteName = domainName.split('.')[0]

  //reddit specific:
  const subReddit = url.split('/r/')[1]
  const rootSite = url.split('/r/')[0]

  return { scrapeId, url, siteName, rootSite, subReddit, scrapeTimestamp, errorLog, 'articleCount' : articlesArray.length, articlesArray }
}

function createArticleObject(url, errorLog, articleDetails) {

  const scrapeTimestamp = new Date()
  const domainName = parseUrl.extractRootDomain(url)
  const hostName = parseUrl.extractHostname(url)
  const siteName = domainName.split('.')[0]

  //reddit specific:
  const subReddit = url.split('/r/')[1]
  const rootSite = url.split('/r/')[0]

  return Object.assign(articleDetails, { 'sourceUrl': url, errorLog})
}

function getRedditArticlesFromSubreddit(url) {

  //Error log as object
  let errorLog = {
    errorCount: 0
  }

  //let scrapeResultsObject = createScrapeResultsObject(url, errorLog, [])
  let articlesArray = []
  const scrapeId = uuid()

  //Connect
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      //Scrape details with cheerio
      const $ = cheerio.load(body)
      const articles = $('article')

      articles.each(function (i, element) {

        let titleEl, titleText, commentsUrl, picUrl, articleUrl

        //Title
        titleEl = $('a h2', element)
        titleText = checkUndefined(titleEl.text())

        //Reddit URL
        commentsUrl = checkUndefined(titleEl.parent().attr('href'))
        if (commentsUrl !== "Not Found") {
          commentsUrl = url.split('/r/')[0] + commentsUrl
        }
        //commentsUrl = checkUndefined(titleEl.parent().attr('href'))

        //Image URL
        try {
          const picEl = $('a div[role=img]', element)
          picUrl = picEl.css('background-image').slice(4, -1)
        }
        catch (e) {
          picUrl = "Not Found"
          errorLog.errorCount += 1
        }

        //Article URL
        articleUrl = checkUndefined($('div a', element).eq(4).attr('href'))

        //Article Id
        articleId = scrapeId + "-" + i

        //Process
        const articleDetails = { articleId, titleText, commentsUrl, picUrl, articleUrl }

        globalErrorLog.errorCount += errorLog.errorCount

        // scrapeResultsObject.articlesArray.push(articleDetails)
        // scrapeResultsObject.errorLog = errorLog

        const articleObject = createArticleObject(url, errorLog, articleDetails)

        articlesArray.push(articleObject)
        
      })

      //callback
      const scrapeResultsObject = createScrapeResultsObject(url, globalErrorLog, articlesArray, scrapeId)
      scrapeResultHandler(scrapeResultsObject, globalErrorLog)
    }
  })
}