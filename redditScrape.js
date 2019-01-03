const cheerio = require('cheerio');
const request = require('request')
const mongoStore = require('./mongoStore')

scrapeInit()

function scrapeInit() {
  cheerio1()
  console.log('Scraping...')
}

function scrapeResultHandler(result, errs) {
  console.log(result.length + " Articles scraped.")
  console.log(errs + " items not found.")
  //console.log(result)
  mongoStore.storeInit(result)
}

//cheerio test - nice CSS selectors make things easier...
function cheerio1() {

  let resultData = []
  request('https://www.reddit.com/r/futurology', function (error, response, body) {
    if (!error && response.statusCode == 200) {

      const baseUrl = 'https://www.reddit.com'
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
        try { commentsUrl = baseUrl + titleEl.parent().attr('href') }
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

        const articleDetails = { i, titleText, commentsUrl, picUrl, articleUrl }
        resultData.push(articleDetails)

      })
      //callback
      scrapeResultHandler(resultData, errs)
    }
  })
};