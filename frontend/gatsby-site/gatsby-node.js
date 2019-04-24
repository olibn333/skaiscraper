/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMongodbTesting2Articles {
          edges {
            node {
              titleText
              articleUrl
              articleAuthor
              authorProfile
              datePublished
              picUrl
              commentsUrl
              siteLogo
              votesCount
              commentsCount
              bodyText
              keywords
            }
          }
        }
      }
    `).then(result => {
      let keywordList = []
      result.data.allMongodbTesting2Articles.edges.forEach(({ node }, index, allArticles) => {
        if (node.keywords) {
          node.keywords.forEach(word => {
            if (!keywordList.includes(word)) {
              keywordList.push(word)
              if (word === '') return
              createPage({
                path: encodeURIComponent(word),
                component: path.resolve(`./src/templates/articles-by-keyword.js`),
                context: {
                  keyword: word,
                  contextData: allArticles.filter(({ node }) => {
                    if (node.keywords) {
                      if (node.keywords.includes(word)) {
                        return true
                      }
                    }
                  })
                }
              })
            }
          })
        }
      })
      resolve()
    })
  })
}