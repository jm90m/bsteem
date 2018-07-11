import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const LargeLoading = ({ customTheme, style }) => (
  <ActivityIndicator color={customTheme.primaryColor} size="large" style={style} />
);

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

LargeLoading.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  style: PropTypes.shape(),
};

LargeLoading.defaultProps = {
  style: {},
};

export default connect(mapStateToProps)(LargeLoading);
