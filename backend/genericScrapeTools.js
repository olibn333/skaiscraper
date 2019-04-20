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
  checkUndefined(...queries) {
    let result
    for (let [index, query] of queries.entries()) {
      //Check if undefined or empty string
      if (query === undefined || query === null || query.trim().length < 1) {
        //Add error count only when last query checked in array
        if (index === queries.length - 1) {
          this.errorCount += 1
        }
        result = 'Not Found'
      } else if (typeof query === 'string') {
        result = query.replace(/\s+/g, ' ').trim()
        break
      } else {
        result = query
        break
      }
    }
    return result
  }
}


//Returns array of all links in html
function getAllLinksfromHTML(cheerioHTML, originUrl) {

  //const html = await parseUrl.getHTML(url).catch(e=>console.log(e))
  let allLinks = []
  cheerioHTML('a').each((i, el) => allLinks[i] = el.attribs['href'])

  //Replace relative links with absolute

  allLinks.forEach((link, i) => {
    try {
      allLinks[i] = URLParser.resolve(originUrl, link)
    } catch (e) {
      allLinks[i] = originUrl
    }
  })

  return allLinks
}



//Returns array of all links in url
async function getAllLinksfromUrl(url) {
  const html = await parseUrl.getHTML(url).catch(e => console.log(e))
  const cheerioHTML = cheerio.load(html)
  return getAllLinksfromHTML(cheerioHTML)
}

//Returns object with links - internals, externals, uniques, repeats, counts
function analyseLinks(links, originUrl) {

  let linkAnalysis = {
    linksCount: '',
    internalLinks: [],
    externalLinks: [],
    uniqueLinks: [],
    repeatedLinks: []
  }

  linkAnalysis.linksCount = links.length

  const parsedLink = URLParser.parse(originUrl)
  //Hostname without subdomain
  const domainName = parseDomain(originUrl).domain + "." + parseDomain(originUrl).tld

  linkAnalysis.uniqueLinks = Array.from(new Set(links))
  let linksCount = {}
  links.forEach(link => { linksCount[link] = (linksCount[link] || 0) + 1; });
  linkAnalysis.repeatedLinks = Object.keys(linksCount).filter((link, i) => linksCount[link] > 1).map(link => ({ link: link, count: linksCount[link] }))

  //sort((a,b)=>linksCount[b]-linksCount[a]).map(key=>({key:linksCount[key]}))

  linkAnalysis.uniqueLinks.forEach((link, i) => {
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

module.exports = { createScrapeResultsObject, websiteLogo, errorLog, getAllLinksfromHTML, getAllLinksfromUrl, analyseLinks }