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


/* const articles = (props) => {
  const { classes, data, pageContext } = props
  console.log(data)
  return (
    <Grid container spacing={24}>
      {((pageContext.data) ? pageContext.data : data.allMongodbTesting2Articles.edges)
        .map(({ node }, index) => (
          <div className={classes.root} key={index}>
            <Paper className={classes.paper}>
              <Grid container spacing={16}>
                <Grid item>
                  <ButtonBase className={classes.image}>
                    <Badge
                      classes={{ margin: classes.margin, badge: classes.badge }}
                      invisible={node.votesCount < 1}
                      badgeContent={node.votesCount}
                      max={9999}
                      color="primary"
                    >
                      <img className={classes.img} alt="complex" src={node.picUrl} />
                    </Badge>
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={16}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1">
                        <a href={node.articleUrl}>{node.titleText}</a>
                      </Typography>
                      <Typography gutterBottom>{node.bodyText[0]}..</Typography>
                      {(node.datePublished !== 'Not Found') &&
                        <Typography color='textSecondary'>
                          {"Date Published: "}
                          {node.datePublished}
                        </Typography>
                      }
                      {(node.articleAuthor !== 'Not Found') &&
                        <Typography color="textSecondary">
                          {"Article Author: "}
                          <a href={node.authorProfile}>{node.articleAuthor}</a>
                        </Typography>
                      }
                    </Grid>
                    <Grid item>
                      <Badge
                        classes={{ margin: classes.margin, badge: classes.badge }}
                        invisible={node.commentsCount < 1}
                        badgeContent={node.commentsCount}
                        max={9999}
                        color="secondary"
                      >
                        <Button variant="contained" className={classes.button}>
                          <a href={node.commentsUrl}>{"Comments"}</a>
                        </Button>
                      </Badge>
                    </Grid>
                    <Grid item>
                      <Typography>
                        {"Keywords: "}
                        {node.keywords.map((word, index) => {
                          return (word.length > 0) &&
                            <Chip
                              style={{ marginRight: '0.2rem' }}
                              className={classes.chip}
                              key={index}
                              label={word}
                            />
                        })}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <img className={classes.logo} alt="logo" src={node.siteLogo} />
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </div>
        ))}
    </Grid>
  )
} */

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