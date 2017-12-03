import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';

const Container = styled.View`
  align-items: center;
  background: ${COLORS.WHITE.WHITE_SMOKE};
  border-radius: 4px;
  border: 1px solid ${COLORS.WHITE.WHITE_SMOKE};  
  height: 22px;
  justify-content: center;
  margin-left: 6px;
  padding: 0 8px;
`;

const Text = styled.Text`
  font-size: 12px;
  text-align: center;
`;

const ReputationScore = ({ reputation }) => (
  <Container>
    <Text>{reputation}</Text>
  </Container>
);

ReputationScore.propTypes = {
  reputation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ReputationScore.defaultProps = {
  reputation: '0',
};

export default ReputationScore;
