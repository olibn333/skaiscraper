import React from 'react'
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Badge
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons/';
import { withStyles } from '@material-ui/core/styles';
import { blueGrey, red } from '@material-ui/core/colors/';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: blueGrey[100]
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexShrink: 0,
    color: red[900],
    fontWeight: 'bold',
    verticalAlign: 'middle',
  },
  img: {
    clipPath: 'circle(20%)',
    marginLeft: '-5%',
    marginBottom: '0',
  },
  margin: {
    margin: theme.spacing.unit * 2,
  }
});

const Article = ({ data, classes }) => {

  return (
    <ExpansionPanel className={classes.root} elevation={10}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <img className={classes.img} alt="complex" src={data.picUrl} />
        <Typography className={classes.heading}>
          {data.keywords.join(' ')}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>
          {data.titleText}
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Article)