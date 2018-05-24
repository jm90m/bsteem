import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { Button } from 'react-native-elements';

const SecondaryButton = props => (
  <Button borderRadius={3} backgroundColor={props.customTheme.secondaryColor} {...props} />
);

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

SecondaryButton.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps)(SecondaryButton);
