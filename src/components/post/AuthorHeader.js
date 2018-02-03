import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { getReputation } from 'util/steemitFormatters';
import moment from 'moment';
import { COLORS } from 'constants/styles';
import ReputationScore from './ReputationScore';

const PostCreated = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
`;

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
      <PostCreated>{moment(created).fromNow()}</PostCreated>
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
