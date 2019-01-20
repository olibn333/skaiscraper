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
  articleDetails.map( async (article,i) => {
    //Add Facebook Likes and Shares
    const fbLikesShares = await analytics.getFacebookLikesShares(scrapeObj.articlesArray[i].articleUrl)
      .catch(error => console.log("Error in doubleScrape @ articleDetails.map: ", error))
    scrapeObj.articlesArray[i] = Object.assign(scrapeObj.articlesArray[i], { fbData: fbLikesShares }, article)
  })

  //Send to DB
  mongoStore.sendToDB(scrapeObj)
}


scrapeInit()