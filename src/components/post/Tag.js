import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';

const Container = styled.View`
  align-items: center;
  border-radius: 10px;
  border: 2px solid ${COLORS.BLUE.MEDIUM_AQUAMARINE};
  height: 25px;
  justify-content: center;
  padding: 0 10px;
`;

const TagText = styled.Text`
  font-weight: 500;
  font-size: 14px;
  color: ${COLORS.BLUE.MEDIUM_AQUAMARINE};
  text-align: center;
`;

const Tag = ({ tag }) => <Container><TagText>{tag}</TagText></Container>;

Tag.propTypes = {
  tag: PropTypes.string,
};

Tag.defaultProps = {
  tag: '',
};

export default Tag;
