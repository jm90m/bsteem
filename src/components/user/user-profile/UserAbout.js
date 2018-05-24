import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import tinycolor from 'tinycolor2';

const Container = styled.View`
  flex-direction: row;
  padding-bottom: 5px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const About = styled.Text`
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const UserAbout = ({ about, customTheme }) => (
  <Container customTheme={customTheme}>
    <About customTheme={customTheme}>{about}</About>
  </Container>
);

UserAbout.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  about: PropTypes.string,
};

UserAbout.defaultProps = {
  about: '',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(UserAbout);
