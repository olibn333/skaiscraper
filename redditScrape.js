const cheerio = require('cheerio');
const request = require('request')
const mongoStore = require('./mongoStore')
const util = require('util')

scrapeInit()

function handleError(query, eCount) {
  let output
  try {
    output = query.text()
  } catch (error) {
    eCount =+1
    console.log("RETURNS ERROR")
    return "Not found"
  } finally {
    if (output === undefined) {
      eCount =+1
      console.log("RETURNS UNDEFINED")
      return "Not found"
    } else {
      return output
    }
  }
}

function scrapeInit() {
  getRedditArticles('https://www.reddit.com/r/futurology')
  console.log('Scraping...')
}

function scrapeResultHandler(result, errs) {
  // console.log(Object.keys(result.scrapes.articles).length + " Articles scraped.")
  // console.log(errs + " details not found.")
  console.log(result)
  console.log(result.name)

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
        'name' : 'reddit',
        baseUrl : 'https://www.reddit.com',
        scrapes:
        {
          timestamp : timestampNow,
          34 : {
          //articles details go here
          }
        }
      }


/*       let newThing = {
        [name]: {
          scrapes: {
            [timestampNow]: {

            }
          }
        }
      } */


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
/*         try { articleUrl = $('div a', element).eq(4).attr('href') }
        catch (e) { 
          articleUrl = 'Not Found' 
          errs +=1
        } */

        const articleEl = $('diviyvglhub456789ihbv')

        //console.log("WOOOP :", articleEl)
        
        // console.log("WOOOOOOOOOOOOP: " + util.inspect(articleEl))
        // fuckOff = articleEl.eq(18).attr('href')
        // fuckOff = fuckOff.slice(1,6)
        // console.log("SHHHHHHHHHHHHH: " + fuckOff)

        //articleUrl = handleError($('div a', element).eq(4).attr('href'), errs)

        //console.log("WOOOO MATE", $('div a', element).eq(18).attr('href67'))

        //const newThing = handleError(articleUrl, errs)

        //console.log("Article URL: ", articleUrl)

        //
        const articleDetails = { i, titleText, commentsUrl, picUrl, articleUrl }        
        //resultData.scrapes.articles = Object.assign(resultData.scrapes.articles, articleDetails)
        resultData.scrapes[34][i] = articleDetails
        //console.log(newThing.reddit.scrapes)
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
