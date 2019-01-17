import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';

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

const articles = (props) => {
  const { classes, data } = props
  console.log(data)
  return (
    <Layout>
      <Grid container spacing={24}>
        {data.allMongodbTestingArticles.edges.map(({ node }, index) => (
          <div className={classes.root} key={index}>
            <Paper className={classes.paper}>
              <Grid container spacing={16}>
                <Grid item>
                  <ButtonBase className={classes.image}>
                  <Badge
                    classes={{
                      margin: classes.margin,
                      badge: classes.badge
                    }}
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
                      <Typography gutterBottom>Other information</Typography>
                      <Typography color="textSecondary">Article Number: {index}</Typography>
                    </Grid>
                    <Grid item>
                      <Badge
                        classes={{
                          margin: classes.margin,
                          badge: classes.badge
                        }}
                        badgeContent={node.commentsCount}
                        max={9999}
                        color="secondary"
                      >
                        <Button variant="contained" className={classes.button}>
                          <a href={node.commentsUrl}>Comments</a>
                        </Button>
                      </Badge>
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
    </Layout>
  )
}

export const query = graphql`
  query {
    allMongodbTestingArticles(limit: 20) {
      edges {
        node {
          titleText
          articleUrl
          picUrl
          commentsUrl
          siteLogo
          votesCount
          commentsCount
        }
      }
    }
  }
`

articles.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(articles);