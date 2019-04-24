import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'
import Chip from '@material-ui/core/Chip'

const IndexPage = (props) => {

  const topKeywords = (props) => {
    const { data } = props
    const keywords = {}
    data.allMongodbTesting2Articles.edges.forEach(({ node }) => {
      if (node.keywords) {
        node.keywords.forEach((word) => {
          if (Object.keys(keywords).includes(word)) {
            keywords[word] += 1
          } else {
            keywords[word] = 1
          }
        })
      } else {
        return
      }
    })

    const bannedWords = ['', 'found', 'futurologymoderators']

    let result = []
    Object.keys(keywords).forEach((key, index, array) => {
      if (keywords[key] > 3) {
        if (!bannedWords.includes(array[index])) {
          result.push(array[index])
        }
      }
    })
    return (
      result.map(word =>
        <Link to={'/' + word}>
          <Chip style={{ marginRight: '0.2rem', marginTop: '0.2rem', cursor: 'pointer' }} label={word} />
        </Link>
      )
    )
  }
  return (
    <Layout>
      <SEO title="Home" keywords={[`AI`, `scraper`, `skaiscraper`]} />
      <h1>SkaiScraper</h1>
      <p>Welcome to SkaiScraper.</p>
      <h2>Top keywords:</h2>
      {topKeywords(props)}
      <p></p>
      <div>
        <Link to="/getMongoData/">OPEN ARTICLES</Link>
      </div>
      <div>
        <Link to="/getMongoData1/">OPEN ARTICLES1</Link>
      </div>
      <div>
        <Link to="/test/">TEST PAGE</Link>
      </div>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMongodbTesting2Articles {
      edges {
        node {
          keywords
        }
      }
    }
  }
`

export default IndexPage
