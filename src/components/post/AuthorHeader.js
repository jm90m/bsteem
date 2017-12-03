import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import steem from 'steem';
import moment from 'moment';
import ReputationScore from './ReputationScore';
import { COLORS } from 'constants/styles';

const PostCreated = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
`;

const AuthorText = styled.Text`
  font-weight: 700;
  color: ${COLORS.BLUE.MARINER};
`;

const Container = styled.View`
  flex-direction: row;
 `;

const AuthorHeader = ({ author, created, authorReputation }) => (
  <Container>
    <View>
      <AuthorText>{author}</AuthorText>
      <PostCreated>{moment(created).fromNow()}</PostCreated>
    </View>
    <ReputationScore reputation={steem.formatter.reputation(authorReputation)} />
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
