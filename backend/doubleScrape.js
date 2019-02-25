const redditScrape = require('./redditScrape')
const scrapeTools = require('./genericScrapeTools')
const genericScrape = require('./genericScrape')
const mongoStore = require('./mongoStore')
const analytics = require('./analytics')

async function scrapeInit() {
  //Create Scrape Object Shell by parsing initial source url
  const url = 'https://reddit.com/r/Futurology/'
  const scrapeObjShell = scrapeTools.createScrapeResultsObject(url)
  console.log("Scraping " + url + "...")

  //Get Articles from Subreddit
  const articlesArrayObj = await redditScrape.getRedditArticlesFromSubreddit(url)
  
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
  articleDetails.forEach( (article,i) => {
    scrapeObj.articlesArray[i] = Object.assign(scrapeObj.articlesArray[i], article)
  })
  
  //Add some metadata to scrape
  scrapeObj.articleCount = articleDetails.length

  //Send to DB
  const sendResult = await mongoStore.asyncSendToMongoDB2(scrapeObj)

  //Process results
  console.log(sendResult)
}

//Start at reddit, do doublescrape, gather external links from each article, find best links from all sets and scrape them in turn
async function tripleScrape(){

}

scrapeInit()