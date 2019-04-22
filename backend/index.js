const scrape = require('./doubleScrape')


exports.requestScrape = async (req, res) => {
  if (req.query.q == 'oneScrapePlease') {
    const result = await scrape.scrapeInit()
    res.status(200).send('Done in ' + result.timeDiff + 'ms.')
  } 
  else {
    res.status(403).send('Not Authorised')
  }
}