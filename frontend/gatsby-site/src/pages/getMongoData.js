import React from "react"
import { graphql, Link } from "gatsby"
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Articles from '../components/articles'
import Layout from "../components/layout";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: '0.25rem'
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    maxWidth: '100%',
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  logo: {
    margin: 'auto',
    display: 'block',
    width: '50px'
  },
  badge: {
    minWidth: '22px',
    width: 'auto',
    borderRadius: '10px',
    padding: '0px 4px'
  },
  margin: {
    margin: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 3,
  }
});

const articles = ({ data }) => (
  <Layout>
    <Articles data={data.allMongodbTesting2Articles.edges} />
  </Layout>
)

export const query = graphql`
  query {
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
`

articles.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(articles);