import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { getReputation } from 'util/steemitFormatters';
import TimeAgo from 'components/common/TimeAgo';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import ReputationScore from './ReputationScore';

const AuthorText = styled.Text`
  font-weight: 700;
  color: ${props => props.customTheme.primaryColor};
`;

const Container = styled.View`
  flex-direction: row;
`;

const AuthorHeader = ({ author, created, authorReputation, customTheme }) => (
  <Container>
    <View>
      <AuthorText customTheme={customTheme}>{author}</AuthorText>
      <TimeAgo created={created} />
    </View>
    <ReputationScore reputation={getReputation(authorReputation)} />
  </Container>
);

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

AuthorHeader.propTypes = {
  authorReputation: PropTypes.string,
  author: PropTypes.string,
  created: PropTypes.string,
  customTheme: PropTypes.shape().isRequired,
};

AuthorHeader.defaultProps = {
  authorReputation: '',
  author: '',
  created: '',
};

export default connect(mapStateToProps)(AuthorHeader);
