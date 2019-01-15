const cheerio = require('cheerio');
const parseUrl = require('./parseUrl')
const scrapeTools = require('./genericScrapeTools')

const errorLog = new scrapeTools.errorLog

// Creates an ArticlesArray and ErrorLog
async function getRedditArticlesFromSubreddit(url) {

  //Load cheerio with HTML
  const html = await parseUrl.getHTML(url)
  const $ = cheerio.load(html)

  let articlesArray = []

  //Scrape details with cheerio
  const articles = $('article')

  articles.each(function (i, element) {

    let titleEl, titleText, commentsUrl, picUrl, articleUrl, commentsCount, votesCount

    //Title
    titleEl = $('a h2', element)
    titleText = errorLog.checkUndefined(titleEl.text())

    //Reddit URL
    commentsUrl = errorLog.checkUndefined(titleEl.parent().attr('href'))
    if (commentsUrl !== "Not Found") {
      commentsUrl = url.split('/r/')[0] + commentsUrl
    }
    //commentsUrl = checkUndefined(titleEl.parent().attr('href'))

    //Image URL
    try {
      const picEl = $('a div[role=img]', element)
      picUrl = picEl.css('background-image').slice(4, -1)
    }
    catch (e) {
      picUrl = "Not Found"
      errorLog.errorCount += 1
    }

    //Article URL
    articleUrl = errorLog.checkUndefined($('div a', element).eq(4).attr('href'))

    //Article Index
    articleIndex = i

    //Comments Number
    commentsCount = errorLog.checkUndefined($(element).next().find('div > a > span').text().split('comment')[0])
    commentsCount = convertToInt(commentsCount)

    //Votes
    votesCount = errorLog.checkUndefined($(element).parent().siblings().eq(0).text())
    votesCount = convertToInt(votesCount)

    //Process
    const articleDetails = { articleIndex, titleText, commentsUrl, picUrl, articleUrl, votesCount, commentsCount }
    articlesArray.push(articleDetails)

  })
  return { articlesArray, 'errorCount': errorLog.errorCount }
}

function convertToInt(string) {
  if (string.indexOf('k') > 0) {
    return parseFloat(string.trim()) * 1000
  }
  else {
    return parseInt(string.trim())
  }
}

async function getSubredditsFromSearch(searchStr){
  const url = 'https://www.reddit.com/search?q=' + searchStr
  const html = await parseUrl.getHTML(url).catch(e=>console.log(e))
  const $ = cheerio.load(html)
  let allLinks = []

  $('a').each((i,el) => allLinks[i] = el.attribs['href'])

  const allSubreddits = allLinks.filter(link => link.indexOf('/r/')>-1)

  console.log(allSubreddits)

}

//getSubredditsFromSearch('artificial')

module.exports = { getRedditArticlesFromSubreddit }