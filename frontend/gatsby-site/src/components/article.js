import React from 'react'
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  ButtonBase,
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
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  margin: {
    margin: theme.spacing.unit * 2,
  },
  badge: {
    minWidth: '22px',
    width: 'auto',
    borderRadius: '10px',
    padding: '0px 4px'
  },
});

const Article = ({ data, classes }) => {

  return (
    <ExpansionPanel className={classes.root} elevation={10}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Grid container spacing={16}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <Badge
                classes={{
                  badge: classes.badge
                }}
                badgeContent={data.votesCount}
                max={9999}
                color="primary"
              >
                <img className={classes.img} alt="complex" src={data.picUrl} />
              </Badge>
            </ButtonBase>
          </Grid>
        </Grid>
        <Typography className={classes.heading}>
          {data.keywords.join(' ')}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>
          <div className={classes.heading}>{data.titleText}</div>
          <div>{data.bodyText[0]}</div>
          <div>{data.bodyText[1]}</div>
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Article)