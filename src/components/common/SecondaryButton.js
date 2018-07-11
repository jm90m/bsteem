import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FONTS } from 'constants/styles';
import { getCustomTheme } from 'state/rootReducer';
import { Button } from 'react-native-elements';

const SecondaryButton = props => (
  <Button
    borderRadius={3}
    backgroundColor={props.customTheme.secondaryColor}
    fontFamily={FONTS.PRIMARY}
    {...props}
  />
);

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

SecondaryButton.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps)(SecondaryButton);
