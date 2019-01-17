import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Article from '../components/article'



const articles = ({data}) => {

  const sortedData = data.allArticles.edges.sort(
    function(a,b) {
      if (a.node.votesCount > b.node.votesCount){return -1}
      if (a.node.votesCount < b.node.votesCount){return 1}
      return 0
    })
  return (
    <Layout>
        {sortedData.map(({ node }, index) => (
          <Article
            key = {index}
            data = {node}
          />
        ))}
    </Layout>
  )
}

export const query = graphql`
{
  allArticles: allMongodbTestingArticles(limit:20) {
    edges {
      node {
        titleText
        commentsUrl
        picUrl
        articleUrl
        votesCount
        commentsCount
        articleId
        articleTitle
        siteLogo
        keywords
        bodyText        
      }
    }
  }
}
`

export default articles;