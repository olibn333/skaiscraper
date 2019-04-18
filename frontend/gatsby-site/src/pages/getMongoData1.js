import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Article from '../components/article'
import PrimarySearchAppBar from '../components/searchbar'
import { red } from '@material-ui/core/colors/';


const articles = ({ data }) => {

  
  function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj.node[prop]).indexOf(obj.node[prop]) === pos;
    });
  }

  const allArticles = data.allArticles.edges
  const uniqueData = removeDuplicates(allArticles, 'articleUrl')

  // const sortedData = uniqueData.sort(
  //   function (a, b) {
  //     if (a.node.votesCount > b.node.votesCount) { return -1 }
  //     if (a.node.votesCount < b.node.votesCount) { return 1 }
  //     return 0
  //   })
  return (
    <Layout>
      <PrimarySearchAppBar simple color={'red'}/>
      {uniqueData.map(({ node }, index) => (
        <Article
          key={index}
          data={node}
        />
      ))}
    </Layout>
  )
}

export const query = graphql`
{
  allArticles: allMongodbTesting2Articles(
    filter: {
      votesCount : {
        gt : 1
      }
    }
    sort : {
      fields : [votesCount]
      order : DESC
    }
  ) {
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