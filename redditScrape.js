const cheerio = require('cheerio');
const request = require('request')
const mongoStore = require('./mongoStore')

scrapeInit()

function scrapeInit() {
  cheerio1()
  console.log('Scraping...')
}

function scrapeResultHandler(result) {
  console.log(result.length + " Articles scraped.")
  mongoStore.storeInit()
}

//cheerio test - nice CSS selectors make things easier...
function cheerio1() {

  let resultData = []
  request('https://www.reddit.com/r/futurology', function (error, response, body) {
    if (!error && response.statusCode == 200) {

      const baseUrl = 'https://www.reddit.com'
      const $ = cheerio.load(body)
      const articles = $('article')

      articles.each(function (i, element) {

        let titleText, redditUrl, picUrl, articleUrl

        //Title
        try {
          const titleEl = $('a h2', element)
          titleText = titleEl ? titleEl.text() : 'Not Found'
        }
        catch (e) { titleText = 'Not Found' }

        //Reddit URL
        try { redditUrl = baseUrl + titleEl.parent().attr('href') }
        catch (e) { redditUrl = 'Not Found' }

        //Image URL
        try {
          const picEl = $('a div[role=img]', element)
          picUrl = picEl.css('background-image').slice(4, -1)
        }
        catch (e) { picUrl = 'Not Found' }

        //Article URL
        try { articleUrl = $('div a', element).eq(4).attr('href') }
        catch (e) { articleUrl = 'Not Found' }

        const articleDetails = { i, titleText, redditUrl, picUrl, articleUrl }
        resultData.push(articleDetails)

      })
      //callback
      scrapeResultHandler(resultData)
    }
  })
};