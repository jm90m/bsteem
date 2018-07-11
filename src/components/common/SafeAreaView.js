import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';
import { getCustomTheme } from 'state/rootReducer';
import { connect } from 'react-redux';

const SafeAreaViewContainer = props => {
  const styles = {
    flex: 1,
    backgroundColor: props.customTheme.primaryBackgroundColor,
  };
  return <SafeAreaView {...props} style={styles} />;
};

SafeAreaViewContainer.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(SafeAreaViewContainer);
