import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import Body from 'components/post/Body';
import ReputationScore from '../ReputationScore';

const { width } = Dimensions.get('screen');

const Container = styled.View``;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Username = styled.Text`
  font-weight: 700;
  color: ${COLORS.PRIMARY_COLOR};
`;

const CommentCreated = styled.Text`
  margin-left: 5px;
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
`;

const CommentBody = styled.View`
  flex-wrap: wrap;
  width: ${props => width - props.bodyWidthPadding}
  margin-left: 3px;
  padding: 5px 0;
`;

class CommentContent extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    reputation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    body: PropTypes.string,
    depth: PropTypes.number,
  };

  static defaultProps = {
    reputation: 0,
    created: 0,
    body: '',
    depth: 0,
  };

  render() {
    const { username, reputation, created, body, depth } = this.props;
    const bodyWidthPadding = depth === 1 ? 70 : 100;
    return (
      <Container>
        <Header>
          <Username> {username}</Username>
          <ReputationScore reputation={reputation} />
          <CommentCreated>{created}</CommentCreated>
        </Header>
        <CommentBody bodyWidthPadding={bodyWidthPadding}>
          <Body body={body} />
        </CommentBody>
      </Container>
    );
  }
}

export default CommentContent;
