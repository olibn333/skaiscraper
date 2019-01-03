const cheerio = require('cheerio');
const request = require('request')
const mongoStore = require('./mongoStore')

scrapeInit()

function scrapeInit() {
  getRedditArticles('https://www.reddit.com/r/futurology')
  console.log('Scraping...')
}

function scrapeResultHandler(result, errs) {
  console.log(Object.keys(result.scrapes.articles).length + " Articles scraped.")
  console.log(errs + " details not found.")
  console.log(result)

  mongoStore.storeInit(result)
}


function getRedditArticles(url) {
  
  //Connect
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      //Create object to contain articles (db.site.timestamp)
      const timestampNow = new Date().toISOString()

      let resultData =
      {
        name : 'reddit',
        baseUrl : 'https://www.reddit.com',
        scrapes:
        {
          timestamp : timestampNow,
          articles : {
          //articles details go here
          }
        }
      }

      //Scrape details with cheerio
      const $ = cheerio.load(body)
      const articles = $('article')
      let errs = 0

      articles.each(function (i, element) {

        let titleEl, titleText, commentsUrl, picUrl, articleUrl

        //Title
        try {
          titleEl = $('a h2', element)
          titleText = titleEl ? titleEl.text() : 'Not Found'
        }
        catch (e) { 
          titleText = 'Not Found'
          errs +=1
        }

        //Reddit URL
        try { commentsUrl = resultData.baseUrl + titleEl.parent().attr('href') }
        catch (e) { 
          commentsUrl = 'Not Found' 
          errs +=1
          
          return console.log(e)
        }

        //Image URL
        try {
          const picEl = $('a div[role=img]', element)
          picUrl = picEl.css('background-image').slice(4, -1)
        }
        catch (e) { 
          picUrl = 'Not Found' 
          errs +=1
        }

        //Article URL
        try { articleUrl = $('div a', element).eq(4).attr('href') }
        catch (e) { 
          articleUrl = 'Not Found' 
          errs +=1
        }

        //
        const articleDetails = { i, titleText, commentsUrl, picUrl, articleUrl }        
        //resultData.scrapes.articles = Object.assign(resultData.scrapes.articles, articleDetails)
        resultData.scrapes.articles[i] = articleDetails
        
      })
      //callback
      scrapeResultHandler(resultData, errs)
    }
  })
};

function getDate(){
  const timestampNow = new Date().toISOString()
  console.log(timestampNow)
  return timestampNow
}
