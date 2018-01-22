import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import ReputationScore from '../ReputationScore';

const Container = styled.View``;

const Header = styled.View``;

const Username = styled.Text`
  font-weight: 700;
  color: ${COLORS.BLUE.MARINER};
`;

const CommentCreated = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
`;

class CommentContent extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    reputation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  render() {
    const { username, reputation, created } = this.props;
    return (
      <Container>
        <Header>
          <Username> {username}</Username>
          <ReputationScore reputation={reputation} />
          <Created>{created}
          </Created>
        </Header>
      </Container>
    );
  }
}

export default CommentContent;
