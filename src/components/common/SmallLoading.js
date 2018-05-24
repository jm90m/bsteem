import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const Loading = styled.ActivityIndicator``;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

const SmallLoading = ({ style, customTheme }) => (
  <Loading color={customTheme.primaryColor} size="small" style={style} />
);

SmallLoading.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  style: PropTypes.shape(),
};

SmallLoading.defaultProps = {
  style: {},
};

export default connect(mapStateToProps)(SmallLoading);
