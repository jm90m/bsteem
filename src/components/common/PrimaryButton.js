import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { COLORS, FONTS } from 'constants/styles';
import tinycolor from 'tinycolor2';

const PrimaryButton = props => (
  <Button
    borderRadius={3}
    color={
      tinycolor(props.customTheme.primaryColor).isDark()
        ? COLORS.LIGHT_TEXT_COLOR
        : COLORS.DARK_TEXT_COLOR
    }
    backgroundColor={props.customTheme.primaryColor}
    fontFamily={FONTS.PRIMARY}
    {...props}
  />
);

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

PrimaryButton.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps)(PrimaryButton);
