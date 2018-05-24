import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import tinycolor from 'tinycolor2';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;
const TagContainer = styled.View`
  align-items: center;
  border-radius: 3px;
  border: 2px solid ${props => props.customTheme.secondaryColor};
  height: 25px;
  background-color: ${props => props.customTheme.secondaryColor};
  justify-content: center;
  padding: 0 10px;
`;

const TagText = styled.Text`
  font-weight: 500;
  font-size: 14px;
  color: ${props =>
    tinycolor(props.customTheme.secondaryColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
  text-align: center;
`;

const Tag = ({ tag, customTheme }) => (
  <Container>
    <TagContainer customTheme={customTheme}>
      <TagText customTheme={customTheme}>{tag}</TagText>
    </TagContainer>
  </Container>
);

Tag.propTypes = {
  tag: PropTypes.string,
  customTheme: PropTypes.shape().isRequired,
};

Tag.defaultProps = {
  tag: '',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(Tag);
