const redditScrape = require('./redditScrape')
const scrapeTools = require('./genericScrapeTools')
const genericScrape = require('./genericScrape')
const mongoStore = require('./mongoStore')

async function scrapeInit() {
  //Create Scrape Object Shell by parsing initial source url
  const url = 'https://www.reddit.com/r/futurology'
  const scrapeObjShell = scrapeTools.createScrapeResultsObject(url)
  console.log("Scraping " + url + "...")

  //Get Articles from Subreddit
  const articlesArrayObj = await redditScrape.getRedditArticlesFromSubreddit(url)
  console.log(articlesArrayObj.articlesArray.length + " articles scraped with " + articlesArrayObj.errorLog.errorCount + " details not found.")
  
  //Slot articles into scrape object
  const scrapeObj = Object.assign(scrapeObjShell, articlesArrayObj)

  //Use genericScrape to get details of articles
  const articleUrls = scrapeObj.articlesArray.map((article) => article.articleUrl)
  const articleDetails = await genericScrape.scrapeMultipleSites(articleUrls)

  //Slot details into scrape object
  articleDetails.map((article,i) => {
    scrapeObj.articlesArray[i] = Object.assign(scrapeObj.articlesArray[i], article)
  })

  //Send to DB
  mongoStore.sendToDB(scrapeObj)
}

scrapeInit()