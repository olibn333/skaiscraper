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
});

const articles = (props) => {
  const { classes, data } = props
  console.log(data)
  return (
    <Layout>
      <Grid container spacing={24}>
        {data.allMongodbSkaiScraperreferencedArticles.edges.map(({ node }, index) => (
          <div className={classes.root} key={index}>
            <Paper className={classes.paper}>
              <Grid container spacing={16}>
                <Grid item>
                  <ButtonBase className={classes.image}>
                    <Badge className={classes.margin} badgeContent={Math.floor(Math.random() * 1000)} color="primary">
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
                      <Button variant="contained" className={classes.button}>
                        <a href={node.commentsUrl}>Comments</a>
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item>
                    {`siteLogo`}
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
    allMongodbSkaiScraperreferencedArticles(limit: 20) {
      edges {
        node {
          titleText
          articleUrl
          picUrl
          commentsUrl
        }
      }
    }
  }
`

articles.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(articles);