import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Article from '../components/article'



const articles = ({data}) => {
  // const { data } = props
  return (
    <Layout>
        {data.allArticles.edges.map(({ node }, index) => (
          <Article data = {node}/>
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

articles.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default articles;