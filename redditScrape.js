const cheerio = require('cheerio');
const request = require('request')
const htmlparser = require('htmlparser2')

let resultData = []

//TEST RUN:
//htmlparser1()
cheerio1()

//htmlparser2 test - needs custom functions to traverse the resulting DOM
function htmlparser1() {
  request('https://www.reddit.com/r/futurology', function (error, response, body) {
    if (!error && response.statusCode == 200) {

      const dom = htmlparser.parseDOM(body)
      const articles = htmlparser.DomUtils.find((a) => { return (a.name == 'article') }, dom, 1)

      articles.forEach(function (element, i) {
        const miniDOM = []
        miniDOM.push(element)

        //first argument of DomUtils.find is a function that tests if result is true. Might as well write your own? Or better yet write a CSS selector for Domutils...
        const links = htmlparser.DomUtils.find((a) => { return (a.name == 'a') }, miniDOM, 1)
        const heads = htmlparser.DomUtils.find((a) => { return (a.name == 'h2') }, links, 1)
        const title = htmlparser.DomUtils.find((a) => { return (a.type == 'text') }, heads, 1)[0].data
        const articleDetails = { i, title }
        resultData.push(articleDetails)

      })
      console.log(resultData)
    }
  });
};


//cheerio test - nice CSS selectors make things easier...
function cheerio1() {
  request('https://www.reddit.com/r/futurology', function (error, response, body) {
    if (!error && response.statusCode == 200) {

      const baseUrl = 'https://www.reddit.com'
      const $ = cheerio.load(body)
      const articles = $('article')

      articles.each(function (i, element) {

        const titleEl = $('a h2', element)
        const titleText = titleEl.text()

        const redditUrl = baseUrl + titleEl.parent().attr('href')

        const picEl = $('a div[role=img]', element)

        let picUrl
        try{picUrl = picEl.css('background-image').slice(4, -1)}
        catch(e){picUrl = 'not found'}
       
        const articleUrl = $('div a', element).eq(4).attr('href')

        const articleDetails = { i, titleText, redditUrl, picUrl, articleUrl }
        resultData.push(articleDetails)

      })
      console.log(resultData)

    }

  })
};