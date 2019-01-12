const redditScrape = require('./redditScrape')
const scrapeTools = require('./genericScrapeTools')


async function scrapeInit() {
  const url = 'https://www.reddit.com/r/futurology'
  const scrapeObjShell = scrapeTools.createScrapeResultsObject(url)
  console.log("Scraping " + url + "...")
  const articlesArrayObj = await redditScrape.getRedditArticlesFromSubreddit(url)
  console.log(articlesArrayObj.articlesArray.length + " articles scraped with " + articlesArrayObj.errorLog.errorCount + " details not found.")
  
  const scrapeObj = Object.assign(scrapeObjShell, articlesArrayObj)
  const articleUrls = scrapeObj.articlesArray.map((article) => article.articleUrl)
  console.log("Scraping body text from these:", articleUrls)
  //console.log(scrapeObj)
}

scrapeInit()