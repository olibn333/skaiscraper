const scrape = require('./doubleScrape')


exports.requestScrape = (req, res) => {
  if (req.body = 'secretpassword') {
    scrape.scrapeInit()
    res.status(200).send('Scraping...')} 
  else {
    res.status(403).send('Not Authorised')
  }
}