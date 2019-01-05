const cheerio = require('cheerio');
const request = require('request')
const mongoStore = require('./mongoStore')

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


function scrapeResultHandler(scrapeResultsObject) {

  console.log(scrapeResultsObject.length + " Articles scraped.")
  console.log(globalErrorLog.errorCount + " Details not found.")
  //console.log(scrapeResultsObject)

  mongoStore.sendToDB(scrapeResultsObject)
}

function createScrapeResultsObject(url, errorLog, articlesArray) {

  const scrapeTimestamp = new Date()
  const domainName = extractRootDomain(url)
  const hostName = extractHostname(url)
  const siteName = domainName.split('.')[0]

  //reddit specific:
  const subReddit = url.split('/r/')[1]
  const rootSite = url.split('/r/')[0]

  return { url, siteName, rootSite, subReddit, scrapeTimestamp, errorLog, articlesArray }
}

function createArticleObject(url, errorLog, articleDetails) {

  const scrapeTimestamp = new Date()
  const domainName = extractRootDomain(url)
  const hostName = extractHostname(url)
  const siteName = domainName.split('.')[0]

  //reddit specific:
  const subReddit = url.split('/r/')[1]
  const rootSite = url.split('/r/')[0]

  return { url, siteName, rootSite, subReddit, scrapeTimestamp, errorLog, articleDetails }
}

function getRedditArticlesFromSubreddit(url) {

  //Error log as object
  let errorLog = {
    errorCount: 0
  }

  //let scrapeResultsObject = createScrapeResultsObject(url, errorLog, [])
  let scrapeResultsObject = []

  //Connect
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      let articleObject = createArticleObject(url, errorLog, [])

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
          commentsUrl = articleObject.rootSite + commentsUrl
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

        //Process
        const articleDetails = { i, titleText, commentsUrl, picUrl, articleUrl }
        // scrapeResultsObject.articlesArray.push(articleDetails)
        // scrapeResultsObject.errorLog = errorLog

        globalErrorLog.errorCount += errorLog.errorCount
        articleObject.articleDetails = articleDetails
        scrapeResultsObject.push(articleObject)
        
      })

      //callback
      scrapeResultHandler(scrapeResultsObject)
    }
  })
}


//Ripped ruthlessly from https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
function extractHostname(url) {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

// To address those who want the "root domain," use this function:
function extractRootDomain(url) {
  let domain = extractHostname(url),
    splitArr = domain.split('.'),
    arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain 
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
      //this is using a ccTLD
      domain = splitArr[arrLen - 3] + '.' + domain;
    }
  }
  return domain;
}