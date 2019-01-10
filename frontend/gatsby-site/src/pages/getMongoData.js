import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const articles = ({ data }) => {
  console.log(data)
  return (
    <Layout>
      <Paper style={{ padding: '10px' }}>
        <div>
          <h1>Articles:</h1>
          <Table>
            <TableHead>
              <TableRow>
                <th>Article Comments</th>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.allMongodbSkaiScraperreferencedArticles.edges.map(({ node }, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <a href={node.commentsUrl}>{node.titleText}</a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMongodbSkaiScraperreferencedArticles(limit: 10) {
      edges {
        node {
          titleText
          commentsUrl
        }
      }
    }
  }
`

export default articles