import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Article from '../components/article'



const articles = ({data}) => {
  // const { data } = props
  return (
    <Layout>
        {data.allArticles.edges.map(({ node }, index) => (
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