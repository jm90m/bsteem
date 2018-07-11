import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import PrimaryText from 'components/common/text/PrimaryText';
import tinycolor from 'tinycolor2';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: 5px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const Location = styled(PrimaryText)`
  margin-left: 5px;
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const UserLocation = ({ location, customTheme }) => (
  <Container customTheme={customTheme}>
    <MaterialIcons
      name={MATERIAL_ICONS.location}
      size={ICON_SIZES.userHeaderIcon}
      color={
        tinycolor(customTheme.primaryBackgroundColor).isDark()
          ? COLORS.LIGHT_TEXT_COLOR
          : COLORS.DARK_TEXT_COLOR
      }
    />
    <Location customTheme={customTheme}>{location}</Location>
  </Container>
);

UserLocation.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  location: PropTypes.string,
};

UserLocation.defaultProps = {
  location: '',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(UserLocation);
