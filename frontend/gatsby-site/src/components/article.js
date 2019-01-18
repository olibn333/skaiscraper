import React from 'react'
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  ButtonBase,
  Badge,
  Divider,
  Avatar
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons/';
import { withStyles } from '@material-ui/core/styles';
import { blueGrey, red } from '@material-ui/core/colors/';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: blueGrey[100]
  },
  title: {
    flexShrink: 0,
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    color: red[900],
    fontWeight: 500,
    verticalAlign: 'middle',
  },
  bigAvatar: {
    margin: 10,
    width: 70,
    height: 70,
  },
  avImg : {
    marginBottom : 0
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
  tight : {
    padding: 0
  }
});

const Article = ({ data, classes }) => {

  return (
    <ExpansionPanel className={classes.root} elevation={10}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Grid container spacing={16}>
          <Grid item className={classes.tight}>
            <ButtonBase className={classes.image}>
              <Badge
                classes={{
                  badge: classes.badge
                }}
                badgeContent={data.votesCount}
                max={9999}
                color="primary"
              >
                <Avatar classes={{img: classes.avImg}} className={classes.bigAvatar} alt="AI" src={data.picUrl} />
              </Badge>
            </ButtonBase>
          </Grid>
        </Grid>
        <Typography className={classes.heading} classes={{ root: classes.title }}>
          {data.keywords.join(' ')}
        </Typography>
      </ExpansionPanelSummary>
      <Divider />
      <ExpansionPanelDetails>
        <Typography variant="h6">
          {data.titleText}
          <Typography variant="body2">
            {data.bodyText[0]}
            {data.bodyText[1]}
          </Typography>
        </Typography>

      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export default withStyles(styles)(Article)