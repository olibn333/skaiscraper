const cheerio = require('cheerio');
const parseUrl = require('./parseUrl')
const genericScrape = require('./genericScrape')

//Checks if query returns undefined
function checkUndefined(query) {
  if (query === undefined) {
    errorLog.errorCount += 1
    return "Not found"
  } else {
    return query
  }
}

async function getRedditArticlesFromSubreddit(url) {

  //Load cheerio with HTML
  const html = await parseUrl.getHTML(url)
  const $ = cheerio.load(html)

  //Shell objects
  const errorLog = {
    errorCount: 0
  }

  let articlesArray = []

  //Scrape details with cheerio
  const articles = $('article')

  articles.each(async function (i, element) {

    let titleEl, titleText, commentsUrl, picUrl, articleUrl, commentsCount, votesCount

    //Title
    titleEl = $('a h2', element)
    titleText = checkUndefined(titleEl.text())

    //Reddit URL
    commentsUrl = checkUndefined(titleEl.parent().attr('href'))
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
    articleUrl = checkUndefined($('div a', element).eq(4).attr('href'))

    //Article Index
    articleIndex = i

    //Comments Number
    commentsCount = $(element).next().find('div > a > span').text().split('comment')[0]

    //Votes
    votesCount = $(element).parent().siblings().eq(0).text()

    //Fetch article body text
    try {
      await genericScrape.fetch(encodeURI(articleUrl), 'bodyText')
        .then(function(response) {
          //Process
          const articleDetails = { articleIndex, titleText, commentsUrl, picUrl, articleUrl, votesCount, commentsCount, 'bodyText': response }
          
          globalErrorLog.errorCount += errorLog.errorCount

          const articleObject = createArticleObject(url, errorLog, articleDetails)

          articlesArray.push(articleObject)
        })
    } catch (error) {
      console.log("redditScrape: genericScrape failed to fetch " + articleUrl)
    }
  })
  return { articlesArray, errorLog }
}

module.exports = { getRedditArticlesFromSubreddit }