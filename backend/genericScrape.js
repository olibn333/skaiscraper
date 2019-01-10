const cheerio = require('cheerio');
const request = require('request')
const uuid = require('uuid/v1');
const mongoStore = require('./mongoStore')
const parseUrl = require('./parseUrl')

//Very basic scrape of body text. Needs improving!
function genericScrape(url) {
  const articleId = uuid()
  const scrapeTimestamp = new Date()
  const domainName = parseUrl.extractRootDomain(url)
  const siteName = domainName.split('.')[0]

  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        //Scrape details with cheerio
        const $ = cheerio.load(body)
        const paragraphs = $('p')
        let bodyText = []
  
        paragraphs.each(function (i, element) {
          const currentParagraph = $(this, element)
          bodyText.push(currentParagraph.text())
        })
        //Return result as object
        resolve({ scrapeTimestamp, articleId, siteName, 'articleUrl': url, bodyText })

      } else if (error) {
        reject(error)
      }
    })
  })
}

async function scrapeMultipleSites(urls) {
  let scrapedSitesData = []
  for (url of urls) {
    console.log("Scraping ", url)
    //Await promise to resolve
    const scrapeData = await genericScrape(url)
    console.log(scrapeData)
    scrapedSitesData.push(scrapeData)
    }
  //console.log(scrapedSitesData)
  console.log("SCRAPE COMPLETE")
  return scrapedSitesData
}

//Arbitrary array of article urls
const sitesToScrape = [
  'https://www.the-scientist.com/features/can-viruses-in-the-genome-cause-disease--65212',
  'https://electrek.co/2019/01/05/tesla-autopilot-control-sliding-ice-video/',
  'https://newatlas.com/hyundai-elevate-walking-car/57865/',
  'https://www.modernhealthcare.com/article/20190104/NEWS/190109951'
]

//Working, except not writing to database
//!!MongoError: docs parameter must be an array of documents
(async () => {
  let scrapeResults = await scrapeMultipleSites(sitesToScrape)
  scrapeResults = { ...scrapeResults }
  mongoStore.sendToDB(scrapeResults)
})().catch(err => {
  console.error(err)
})