import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import PrimarySearchAppBar from './searchbar'

import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: '#f44336',
    },
  },
});

const Header = ({ siteTitle }) => (
  <div style={{ marginBottom: `1.45rem` }}>
    <PrimarySearchAppBar title={siteTitle}></PrimarySearchAppBar>
  </div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``
}

export default Header
