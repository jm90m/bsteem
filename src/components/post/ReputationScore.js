import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import tinycolor from 'tinycolor2';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const Container = styled.View`
  align-items: center;
  background: ${props => props.customTheme.tertiaryColor};
  border-radius: 4px;
  border: 1px solid ${props => props.customTheme.tertiaryColor};
  height: 22px;
  justify-content: center;
  margin-left: 6px;
  padding: 0 8px;
`;

const Text = styled.Text`
  font-size: 12px;
  text-align: center;
  color: ${props =>
    tinycolor(props.customTheme.tertiaryColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const ReputationScore = ({ reputation, customTheme }) => (
  <Container customTheme={customTheme}>
    <Text customTheme={customTheme}>{reputation}</Text>
  </Container>
);

ReputationScore.propTypes = {
  reputation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customTheme: PropTypes.shape().isRequired,
};

ReputationScore.defaultProps = {
  reputation: '0',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(ReputationScore);
