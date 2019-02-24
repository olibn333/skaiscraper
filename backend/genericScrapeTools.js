const uuid = require('uuid/v1');
const parseUrl = require('./parseUrl')
const websiteLogo = require('website-logo')
const cheerio = require('cheerio');
const URLParser = require('url')
const parseDomain = require("parse-domain")

//Creates the 'shell' for scrape results object
function createScrapeResultsObject(url) {

  const scrapeId = uuid()
  const scrapeTimestamp = new Date()
  const urlDetails = parseUrl.extractUrlDetails(url)
  const articlesArray = []
  //Record Scrape Errors
  const errorLog = {
    errorCount: 0
  }
  const scrapeResultsObject = Object.assign({ scrapeId, scrapeTimestamp, articlesArray, errorLog }, urlDetails)

  return scrapeResultsObject
}

class errorLog {
  constructor() {
    this.errorCount = 0
  }
  checkUndefined(query) {
    if (query === undefined) {
      this.errorCount += 1
      return "Not Found"
    } else if (typeof query === 'string') {
      return query.replace(/\s+/g, ' ').trim()
    } else {
      return query
    }
  }
}

//Returns array of all links in url
async function getAllLinksfromUrl(url) {
  const html = await parseUrl.getHTML(url).catch(e => console.log(e))
  const $ = cheerio.load(html)
  let allLinks = []
  $('a').each((i, el) => allLinks[i] = el.attribs['href'])
  //Replace relative links with absolute
  allLinks.forEach((link, i) => allLinks[i] = URLParser.resolve(url, link))
  return allLinks
}

//Returns array of all links in html
function getAllLinksfromHTML(html) {

  //const html = await parseUrl.getHTML(url).catch(e=>console.log(e))
  const $ = cheerio.load(html)
  let allLinks = []
  $('a').each((i, el) => allLinks[i] = el.attribs['href'])
  //Replace relative links with absolute
  allLinks.forEach((link, i) => allLinks[i] = URLParser.resolve(url, link))
  return allLinks
}

//Returns object with links - internals, externals, uniques, repeats, counts
function analyzeLinks(links, originUrl) {

  let linkAnalysis = {
    internalLinks: [],
    externalLinks: [],
    uniqueLinks: [],
    linksCount: [],
    repeatedLinks: []
  }

  const parsedLink = URLParser.parse(originUrl)
  //Hostname without subdomain
  const domainName = parseDomain(originUrl).domain + "." + parseDomain(originUrl).tld

  linkAnalysis.uniqueLinks = Array.from(new Set(links))
  let linksCount = {}
  links.forEach(link => { linksCount[link] = (linksCount[link] || 0) + 1; });
  linkAnalysis.linksCount = linksCount 
  linkAnalysis.repeatedLinks = Object.keys(linksCount).filter((link, i) => linksCount[link] > 1).map(link=>({link:link, count:linksCount[link]}))
  
  //sort((a,b)=>linksCount[b]-linksCount[a]).map(key=>({key:linksCount[key]}))

  links.forEach((link, i) => {
    //Check for internal links
    if (link.indexOf(domainName) > -1) {
      linkAnalysis.internalLinks.push(link)
    } else {
      //All other valid links assumed external
      linkAnalysis.externalLinks.push(link)
    }
  })

  return linkAnalysis
}


async function test() {
  const url = 'https://www.reddit.com/r/artificial/comments/4tl6y7/in_future_i_want_to_work_with_ai_what/'
  const links = await getAllLinksfromUrl(url)
  const analysis = analyzeLinks(links, url)

  console.log(analysis)

}

//test()

module.exports = { createScrapeResultsObject, websiteLogo, errorLog }