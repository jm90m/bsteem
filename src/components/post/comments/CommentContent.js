import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import Body from 'components/post/Body';
import ReputationScore from '../ReputationScore';
const Container = styled.View``;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Username = styled.Text`
  font-weight: 700;
  color: ${COLORS.BLUE.MARINER};
`;

const CommentCreated = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
`;

const CommentBody = styled.View``;

class CommentContent extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    reputation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    body: PropTypes.string,
  };

  static defaultProps = {
    reputation: 0,
    created: 0,
    body: '',
  };

  render() {
    const { username, reputation, created, body } = this.props;
    return (
      <Container>
        <Header>
          <Username> {username}</Username>
          <ReputationScore reputation={reputation} />
          <CommentCreated>{created}</CommentCreated>
        </Header>
        <CommentBody>
          <Body body={body} />
        </CommentBody>
      </Container>
    );
  }
}

export default CommentContent;
