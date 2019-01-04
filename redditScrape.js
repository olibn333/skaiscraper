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
  const url = 'https://www.reddit.com/r/futurology'
  getRedditArticles(url)
  console.log('Scraping ' + url + '...')
 }

function scrapeResultHandler(result, site, errs) {
  const scrapes = result[site].scrapes
  //Array of timestamps
  const timestamps = Object.keys(scrapes)
  //Use pop() to get last timestamp key from array
  console.log(Object.keys(scrapes[timestamps.pop()]).length + " Articles scraped.")
  console.log(errs + " Details not found.")
  console.log(result)
  //console.log(timestamps)
  //console.log(result[site].scrapes)

  //mongoStore.storeInit(result)
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

  //TODO - Make generic reddit scraper to feed any subreddit url. 
  //Could pull [name] and [baseUrl] from the url argument of this function.
  // Perhaps could also make some url parsing module for this?

  const domainName = extractRootDomain(url)
  const hostName = extractHostname(url)
  const siteName = domainName.split('.')[0]
  const subReddit = url.split('/r/')[1]
  console.log(domainName, subReddit, hostName, siteName)
  
  
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


//ripped ruthlessly from https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
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