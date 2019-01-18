const redditScrape = require('./redditScrape')
const scrapeTools = require('./genericScrapeTools')
const genericScrape = require('./genericScrape')
const mongoStore = require('./mongoStore')

async function scrapeInit() {
  //Create Scrape Object Shell by parsing initial source url
  const url = 'https://www.reddit.com/r/artificial'
  const scrapeObjShell = scrapeTools.createScrapeResultsObject(url)
  console.log("Scraping " + url + "...")

  //Get Articles from Subreddit
  const articlesArrayObj = await redditScrape.getRedditArticlesFromSubreddit(url).catch(error => console.log("redditScrape.getRedditArticlesFromSubreddit failed to complete!", error))
  console.log(articlesArrayObj.articlesArray.length + " articles scraped with " + articlesArrayObj.errorCount + " details not found.")
  
  //Assign articleIds to articlesArrayObj
  articlesArrayObj.articlesArray.forEach(article => article.articleId = scrapeObjShell.scrapeId + "-" + article.articleIndex)

  //Slot articles into scrape object
  const scrapeObj = Object.assign(scrapeObjShell, articlesArrayObj)

  //Use genericScrape to get details of articles
  const articleUrls = scrapeObj.articlesArray.map((article) => article.articleUrl)
  const articleDetails = await genericScrape.scrapeMultipleSites(articleUrls).catch(error => console.log(error))

  //console.log(articleDetails)

  //Slot details into scrape object
  articleDetails.map((article,i) => {
    scrapeObj.articlesArray[i] = Object.assign(scrapeObj.articlesArray[i], article)
  })

  //Send to DB
  mongoStore.sendToDB(scrapeObj)
}

scrapeInit()