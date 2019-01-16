import React from 'react'
import { Typography } from '@material-ui/core/';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons/';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

const Article = ({data}) => {

  return (
    <ExpansionPanel >
      <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
        <Typography>
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