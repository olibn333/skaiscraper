const cheerio = require('cheerio');
const request = require('request')

let resultData = []

request('https://www.reddit.com/r/futurology', function (error, response, body) {
  if (!error && response.statusCode == 200) {
  const $ = cheerio.load(body)
  const articles = $('article')
  
  articles.each(function(i,element){
    const titleEl = $('a h2', element)
    const picEl = $('a div[role=img]')
    const picUrl = picEl.css('background-image').slice(4,-1)
    const title = titleEl.text()
    const articleUrl = titleEl.parent().attr('href')
    const articleDetails = {i, title, articleUrl, picUrl}
    resultData.push(articleDetails)
  })
  console.log(resultData)
  }

});
