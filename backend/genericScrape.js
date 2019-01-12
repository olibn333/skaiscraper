const cheerio = require('cheerio');
const request = require('request')
const uuid = require('uuid/v1');
const mongoStore = require('./mongoStore')
const parseUrl = require('./parseUrl')
const headline_parser = require("headline-parser");

const scrapeId = uuid()

//Very basic scrape of body text. Needs improving!
function genericScrape(url, returnOnly) {
  const articleId = uuid()
  const scrapeTimestamp = new Date()
  const domainName = parseUrl.extractRootDomain(url)
  const siteName = domainName.split('.')[0]

  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //Scrape details with cheerio
        const $ = cheerio.load(body)
        const articleTitle = $('h1').text()
        const paragraphs = $('p')
        let bodyText = []
  
        paragraphs.each(function(i, element) {
          const currentParagraph = $(this, element).text()
          if (currentParagraph.length > 50) {
            bodyText.push(currentParagraph)
          }
        })

        //Find keywords from title and body
        const keywords = headline_parser.findKeywords(articleTitle, bodyText.join(), 3)
        
        //Return result as object
        // resolve(
        //   { scrapeId, scrapeTimestamp, articleId, siteName, articleTitle, keywords, 'articleUrl': url, bodyText }
        // )

        resolve({ articleTitle, keywords, bodyText })

      } else {
        reject(console.log("Error at genericScrape: " + error + response.statusCode))
      }
    })
  })
}

//Promise test
function asyncSendToDB(data) {
  return new Promise(function(resolve, reject) {
    resolve(mongoStore.sendToDB(data))
  })
}

async function scrapeMultipleSites(urls) {
  let articlesArray = []
  for (url of urls) {
    //Sanitise url
    url = url.replace('‘','').replace('’','')
    console.log("Scraping ", url)
    //Await promise to resolve
    const currentScrapeData = await genericScrape(url)
    //console.log(currentScrapeData)
    articlesArray.push(currentScrapeData)
  }
  return articlesArray
}


//Arbitrary array of article urls
const sitesToScrape = [
  'https://www.the-scientist.com/features/can-viruses-in-the-genome-cause-disease--65212',
  'https://electrek.co/2019/01/05/tesla-autopilot-control-sliding-ice-video/',
  'https://newatlas.com/hyundai-elevate-walking-car/57865/',
  'https://www.modernhealthcare.com/article/20190104/NEWS/190109951'
]

//Initiate scrape
//scrapeMultipleSites(sitesToScrape)

// THIS IS USELESS, BUT IT'S A COOL EXAMPLE OF AN ANONYMOUS ASYNC FUNCTION THAT GETS IMMEDIATELY CALLED
// (async () => {
//   let scrapeResults = await scrapeMultipleSites(sitesToScrape)
//   scrapeResults = { ...scrapeResults }
//   mongoStore.sendToDB(scrapeResults)
// })().catch(err => {
//   console.error(err)
// })

module.exports = { scrapeMultipleSites, genericScrape }