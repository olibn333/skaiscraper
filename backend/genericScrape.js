const cheerio = require('cheerio');
const mongoStore = require('./mongoStore')
const parseUrl = require('./parseUrl')
const headline_parser = require('headline-parser');
const scrapeTools = require('./genericScrapeTools')
const analytics = require('./analytics')

//Very basic scrape of body text. Needs improving!
async function genericScrape(url) {

    const errorLog = new scrapeTools.errorLog

    //Pass to fb api
    const fbLS = await analytics.getFacebookLikesShares(url)

    //Scrape details with cheerio
    const html = await parseUrl.getHTML(url)
    const $ = cheerio.load(html)

    //Article details
    const articleTitle = errorLog.checkUndefined($('h1').text())

    //Date published
    let datePublished = errorLog.checkUndefined($('.date').text(), $('time').text())

    //Get article author
    const authorSelector = [
      "a [rel='author']",
      "div [rel='author']",
      "span [rel='author']"
    ].join()

    const articleAuthor = errorLog.checkUndefined($(authorSelector).text())

    //Get site logo
    const logoSelector = [
      '[id=logo] img',
      '[id*=logo] img',
      '[class=logo] img',
      '[class*=logo] img'
    ].join()

    let siteLogo = errorLog.checkUndefined($(logoSelector).attr('src'))
    if (siteLogo === 'Not Found') {
      siteLogo = 'http://' + parseUrl.extractRootDomain(url) + '/favicon.ico'
    }

    //Scrape all links
    const allLinks = scrapeTools.getAllLinksfromHTML($, url)
    const linkAnalysis = scrapeTools.analyseLinks(allLinks, url)
    
    //Get body text
    let bodyText = []
    const paragraphs = $('p')

    paragraphs.each(function(i, element) {
      const currentParagraph = $(element).text().replace(/\s+/g, ' ').trim()
      if (currentParagraph.length > 50) {
        bodyText.push(currentParagraph)
      }
    })

    //Find keywords from title and body
    const keywordsTry = headline_parser.findKeywords(articleTitle, bodyText.join(), 3) || ['']
    const keywords = Array.isArray(keywordsTry) ? keywordsTry : ['']

    console.log("Got", bodyText.length, "paras with keywords:", keywords)
    console.log(errorLog.errorCount + " details not found.")

    return {
      articleTitle,
      datePublished,
      articleAuthor,
      siteLogo,
      keywords,
      bodyText,
      fbLikes:fbLS.likes,
      fbShares:fbLS.shares,
      linkAnalysis
    }

    //reject("Something went wrong in genericScrape..")
  
}

//websitelogotest
function getImages() {
  scrapeTools.websiteLogo('https://www.reddit.com/', (error, images) => {
    //have to do stuff with images here
    websiteimagesHandler(images)
  })
}

function websiteimagesHandler(images){
  //or here
  console.log(images)
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
    console.log("Scraping ", url)
    //Await promise to resolve
    const currentScrapeData = await genericScrape(url).catch(error => console.log(error))
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