import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data }) => {
  console.log(data)
  return (
    <Layout>
      <div>
        <h1>Articles:</h1>
        <table>
          <thead>
            <tr>
              <th>Article Comments</th>
            </tr>
          </thead>
          <tbody>
            {data.allMongodbSkaiScraperreferencedArticles.edges.map(({ node }, index) => (
              <tr key={index}>
                <td><a href={node.commentsUrl}>{node.titleText}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query{
    allMongodbSkaiScraperreferencedArticles{
      edges{
        node{
          titleText
          commentsUrl
        }
    }
  }
}
`