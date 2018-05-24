import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar } from 'react-native';
import { getCustomTheme } from 'state/rootReducer';
import { connect } from 'react-redux';
import tinycolor from 'tinycolor2';

const StatusBarContainer = ({ customTheme }) => (
  <StatusBar
    barStyle={
      tinycolor(customTheme.primaryBackgroundColor).isDark() ? 'light-content' : 'dark-content'
    }
  />
);

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

StatusBarContainer.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps)(StatusBarContainer);
