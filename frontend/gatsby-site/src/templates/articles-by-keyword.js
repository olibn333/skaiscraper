import React from 'react'
import Layout from '../components/layout'
import Articles from '../components/articles'

const ArticlesByKeyword = ({ pageContext }) => (
  <Layout>
    <h1>{pageContext.keyword}</h1>
    <Articles data={pageContext} />
  </Layout>
)

export default ArticlesByKeyword