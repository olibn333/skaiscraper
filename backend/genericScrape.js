const cheerio = require('cheerio');
const request = require('request')
const uuid = require('uuid/v1');
const mongoStore = require('./mongoStore')
const handleDomain = require('./handleDomain')

function genericScrape(url) {
  const articleId = uuid()
  const scrapeTimestamp = new Date()
  const domainName = handleDomain.extractRootDomain(url)
  const siteName = domainName.split('.')[0]

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

      const articleDetails = { scrapeTimestamp, articleId, siteName, 'articleUrl': url, bodyText }
      mongoStore.sendToDB(articleDetails)
    }
  })
}

genericScrape('https://www.the-scientist.com/features/can-viruses-in-the-genome-cause-disease--65212')