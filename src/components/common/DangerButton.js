import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const DangerButton = props => (
  <Button borderRadius={3} backgroundColor={props.customTheme.negativeColor} {...props} />
);

DangerButton.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(DangerButton);
