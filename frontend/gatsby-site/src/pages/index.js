import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

const IndexPage = ({data}) => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>SkaiScraper</h1>
    <p>Welcome to SkaiScraper.</p>
    <div>
      <Link to="/getMongoData/">OPEN ARTICLES</Link>
    </div>
    <div>
      <Link to="/test/">TEST PAGE</Link>
    </div>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
  </Layout>
)


export default IndexPage
