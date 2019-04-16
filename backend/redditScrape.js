const cheerio = require('cheerio');
const parseUrl = require('./parseUrl')
const scrapeTools = require('./genericScrapeTools')

const errorLog = new scrapeTools.errorLog

// Creates an ArticlesArray and ErrorLog
async function getRedditArticlesFromSubreddit(url) {

  function isOldReddit(url) {
    if (url.indexOf('//old.') > -1) {
      return true
    } else {
      return false
    }
  }

  if (isOldReddit(url)) {
   return getOldReddit(url)
  } else {
    return getNewReddit(url)
  }
}

async function getNewReddit(url){
  //Load cheerio with HTML
  const html = await parseUrl.getHTML(url)
  const $ = cheerio.load(html)

  let articlesArray = []

  //Scrape details with cheerio
  const articles = $('article')

  articles.each(function (i, element) {

    let titleEl, titleText, commentsUrl, picUrl, articleUrl, commentsCount, votesCount

    //Article URL
    articleUrl = errorLog.checkUndefined($('div a', element).eq(4).attr('href'))

    if (articleUrl.indexOf('youtu') > -1) {
      return true
    }

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

async function getOldReddit(url){
  //Load cheerio with HTML
  const html = await parseUrl.getHTML(url)
  const $ = cheerio.load(html)

  let articlesArray = []

  //Scrape details with cheerio
  const articles = $('.thing')

  articles.each(function (i, element) {

    // let titleEl, titleText, commentsUrl, picUrl, articleUrl, commentsCount, votesCount

    //Skip scrape of moderator topics
    if ($('.stickied-tagline', element).text()) return true

    //Title
    const titleEl = $('a.title', element)
    const titleText = errorLog.checkUndefined(titleEl.text())

    //Time Submitted
    const timeSubmitted = errorLog.checkUndefined($('.live-timestamp', element).attr('datetime'))
    
    //Article URL
    let articleUrl = errorLog.checkUndefined(titleEl.attr('href'))
    if (articleUrl.indexOf('/r/') == 0) {
      articleUrl = url.split('/r/')[0] + articleUrl
    }

    //Reddit URL & Comments Count
    const commentsEl = $('a.comments', element)
    const commentsUrl = errorLog.checkUndefined(url.split('/r/')[0] + commentsEl.attr('href'))
    const commentsCount = convertToInt(commentsEl.text().split('comments')[0])

    //Votes
    const votesEl = $('div.score.unvoted', element)
    const votesCount = convertToInt(votesEl.text())

    //Image URL
    const picEl = $('a.thumbnail > img', element)
    const picUrl = errorLog.checkUndefined(picEl.attr('src'))

    if (picUrl.indexOf('//') === 0) {
      picUrl = 'http:' + picUrl
    }

    //Article Index
    articleIndex = i
    
    //Process
    const articleDetails = { articleIndex, titleText, timeSubmitted, commentsUrl, picUrl, articleUrl, votesCount, commentsCount }
    if (parseUrl.validUrl.isWebUri(articleUrl)){
    articlesArray.push(articleDetails)
    } 
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


//Returns a resolved promise with an array of all subreddits associated with a search term
async function getSubredditsFromSearch(searchStr){

  function formatUrl(url){
    const begin = url.indexOf('/r/')
    const end = url.indexOf('/',begin + 3) + 1 || url.length
    return url.slice(begin,end)
  }
  
  const searchStrURI = console.log(encodeURI(searchStr))
  const url = 'https://www.reddit.com/search?q=' + searchStrURI
  const html = await parseUrl.getHTML(url).catch(e=>console.log(e))
  const $ = cheerio.load(html)
  let allLinks = []

  $('a').each((i,el) => allLinks[i] = el.attribs['href'])

  const subRedditsOnly = allLinks.filter(link => link.indexOf('/r/')>-1)
  const uniqueSubs = Array.from(new Set(subRedditsOnly))
  const formattedSubs = uniqueSubs.map(link => formatUrl(link))
  const allUniqueSubreddits = Array.from(new Set(formattedSubs))

  return allUniqueSubreddits
}

module.exports = { getRedditArticlesFromSubreddit, getSubredditsFromSearch}