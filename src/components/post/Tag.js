import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;
const TagContainer = styled.View`
  align-items: center;
  border-radius: 3px;
  border: 2px solid ${COLORS.SECONDARY_COLOR};
  height: 25px;
  background-color: ${COLORS.SECONDARY_COLOR};
  justify-content: center;
  padding: 0 10px;
`;

const TagText = styled.Text`
  font-weight: 500;
  font-size: 14px;
  color: ${COLORS.WHITE.WHITE};
  text-align: center;
`;

// const TagTriangle = styled.View`
//   border-top-width: 12px;
//   border-right-width: 12px;
//   border-bottom-width: 12px;
//   border-left-width: 0;
//   border-top-color: transparent;
//   border-right-color: ${COLORS.SECONDARY_COLOR};
//   border-bottom-color: transparent;
//   border-left-color: transparent;
//   padding-right: 3px;
//   z-index: 1;
// `;

const Tag = ({ tag }) => (
  <Container>
    <TagContainer>
      <TagText>{tag}</TagText>
    </TagContainer>
  </Container>
);

Tag.propTypes = {
  tag: PropTypes.string,
};

Tag.defaultProps = {
  tag: '',
};

export default Tag;
