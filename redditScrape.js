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
  getRedditArticlesFromSubreddit(url)
  console.log('Scraping ' + url + '...')
 }


function scrapeResultHandler(result, errs) {
  // const scrapes = result[site].scrapes
  //Array of timestamps
  // const timestamps = Object.keys(scrapes)
  //Use pop() to get last timestamp key from array
  //console.log(Object.keys(scrapes[timestamps.pop()]).length + " Articles scraped.")
  //console.log(result)
  //console.log(timestamps)
  //console.log(result[site].scrapes)

  //console.log(result.site.subCategories.scrape.length)
  console.log(result.site.subCategory.scrape.articles.length + " Article(s) Scraped.")
  console.log(errs + " Detail(s) not found.")
  console.log("Test title call: ", result.site.subCategory.scrape.articles[23].titleText)
  console.log(result)

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

function createSiteResultsObject(url) {
  
  //TODO - Make generic reddit scraper to create the correct object result for any subreddit url. 
  //Could pull [name] and [baseUrl] from the url argument of this function. May need to add subreddit object in our structure?
  // Perhaps could also make a url parsing module for this?

  const timestampNow = new Date().toISOString()

  const domainName = extractRootDomain(url)
  const hostName = extractHostname(url)
  const siteName = domainName.split('.')[0]

  //reddit specific:
  const subReddit = url.split('/r/')[1]
  const rootSite = url.split('/r/')[0]

  console.log("Some potential variable names:", rootSite, domainName, subReddit, hostName, siteName)

  //trying to imagine the top level object for easy indexing. 
  //constant key strings seems better performance for indexing the mongodb
  return {
    'site' : {
      'name' : siteName,
      'url' : rootSite,
      'subCategory' : {
        'name' : subReddit,
        'url' : url,
        'scrape' : {
          'timestamp' : timestampNow,
          'articles' : [
            //articleDetails here
          ]
        }
      }
    }
  }
}

function getRedditArticlesFromSubreddit(url) {
  
  //Connect
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      let resultData = createSiteResultsObject(url)
      //Create object to contain articles (db.site.scrapes.timestamp)
      //let resultData = createResultsObject('reddit', 'https://www.reddit.com')

      //Create timestamp for scrape session
      //const timestampNow = new Date().toISOString()

      //Create empty object with timestamp
      //resultData.reddit.scrapes[timestampNow] = {}

      //Scrape details with cheerio
      const $ = cheerio.load(body)
      const articles = $('article')

      articles.each(function (i, element) {

        let titleEl, titleText, commentsUrl, picUrl, articleUrl

        //Title
        titleEl = $('a h2', element)
        titleText = checkUndefined( titleEl.text() )

        //Reddit URL
        commentsUrl = resultData.site.url + checkUndefined( titleEl.parent().attr('href') )

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
        //i += 1

        const articleDetails = {i, titleText, commentsUrl, picUrl, articleUrl}
        
        //resultData.site.subCategory.scrapes.articles.push(articleDetails)
        resultData.site.subCategory.scrape.articles.push(articleDetails)

        // let currentScrape = resultData.reddit.scrapes[timestampNow]
        // currentScrape[i] = Object.assign({}, articleDetails)

      })
      //callback
      //const result = createSiteResultsObject(url, resultData)
      scrapeResultHandler(resultData, errorLog.errorCount)
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