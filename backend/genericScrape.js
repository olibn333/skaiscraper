const cheerio = require('cheerio');
const mongoStore = require('./mongoStore')
const parseUrl = require('./parseUrl')
const headline_parser = require('headline-parser');
const scrapeTools = require('./genericScrapeTools')

const errorLog = new scrapeTools.errorLog

//Very basic scrape of body text. Needs improving!
function genericScrape(url) {
  const domainName = parseUrl.extractRootDomain(url)

  return new Promise(async function(resolve, reject) {

    //Scrape details with cheerio
    const html = await parseUrl.getHTML(url)
    const $ = cheerio.load(html)

    //Article details
    const articleTitle = errorLog.checkUndefined($('h1').text())

    //Get site logo

    //Try this in next attempt $('meta[property="og:image"]').attr('content')
    const getLogo = await new Promise((resolve) => {
      scrapeTools.websiteLogo('http://' + parseUrl.extractHostname(url), (error, images) => {
        if (error) console.log(error)
        resolve(images)
      })
    })

    const siteLogo = (getLogo.openGraph) ? getLogo.openGraph : getLogo.icon

    // const siteLogo = await getLogo.then((images) => {
    //   console.log("SITE LOGO IS.....", images.icon)
    //   if (images.openGraph) {
    //     return images.openGraph
    //   } else {
    //     return images.icon
    //   }
    // }).catch(error => console.log("IT FUCKED UP", error))

    // const getLogo = async (url) => {
    //   const logo = await scrapeTools.websiteLogo(url, (error, images) => {
    //     if (error) console.log("getLogo error: ", error)
    //     if (images.openGraph) {
    //       // console.log(images)
    //       return images.openGraph
    //     } else {
    //       // console.log(images)
    //       return images.icon
    //     }
    //   })
    //   return logo
    // }

    // // const siteLogo = await getLogo('http://' + parseUrl.extractHostname(url))

    // console.log("please for the love of god work", await getLogo('http://' + parseUrl.extractHostname(url)))

    // let siteLogo
    
    //Get body text
    let bodyText = []
    const paragraphs = $('p')

    paragraphs.each(function(i, element) {
      const currentParagraph = $(element).text()
      if (currentParagraph.length > 50) {
        bodyText.push(currentParagraph)
      }
    })

    //Find keywords from title and body
    const keywords = headline_parser.findKeywords(articleTitle, bodyText.join(), 3) || ['no keywords']

    console.log("Got", bodyText.length, "paras with keywords:", keywords)
    resolve({ articleTitle, siteLogo, keywords, bodyText })

    reject("Something went wrong in genericScrape..")
  })
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
    //Sanitise url
    url = url.replace('‘','').replace('’','')
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