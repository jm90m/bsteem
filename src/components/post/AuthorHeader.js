import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { getReputation } from 'util/steemitFormatters';
import TimeAgo from 'components/common/TimeAgo';
import { COLORS } from 'constants/styles';
import ReputationScore from './ReputationScore';

const AuthorText = styled.Text`
  font-weight: 700;
  color: ${COLORS.PRIMARY_COLOR};
`;

const Container = styled.View`
  flex-direction: row;
`;

const AuthorHeader = ({ author, created, authorReputation }) => (
  <Container>
    <View>
      <AuthorText>{author}</AuthorText>
      <TimeAgo created={created} />
    </View>
    <ReputationScore reputation={getReputation(authorReputation)} />
  </Container>
);

AuthorHeader.propTypes = {
  authorReputation: PropTypes.string,
  author: PropTypes.string,
  created: PropTypes.string,
};

AuthorHeader.defaultProps = {
  authorReputation: '',
  author: '',
  created: '',
};

export default AuthorHeader;
