import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import TimeAgo from 'components/common/TimeAgo';
import HTML from 'react-native-render-html';
import ReputationScore from '../ReputationScore';
import { getHtml } from '../../../util/postUtils';

const Container = styled.View``;

const Header = styled.View``;

const HeaderContent = styled.View`
  flex-direction: row;
`;

const Username = styled.Text`
  font-weight: 700;
  color: ${COLORS.PRIMARY_COLOR};
`;

const CommentBody = styled.View`
  flex-wrap: wrap;
  max-width: ${props => props.maxWidth}
  margin-left: 3px;
  padding: 5px 0;
`;

class CommentContent extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    currentWidth: PropTypes.number.isRequired,
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
    const { username, reputation, created, body, depth, currentWidth } = this.props;
    const bodyWidthPadding = depth === 1 ? 70 : 100;
    const maxWidth = currentWidth - bodyWidthPadding;
    const parsedHtmlBody = getHtml(body, {});

    return (
      <Container>
        <Header>
          <HeaderContent>
            <Username> {username}</Username>
            <ReputationScore reputation={reputation} />
          </HeaderContent>
          <TimeAgo created={created} style={{ marginLeft: 3 }} />
        </Header>
        <CommentBody maxWidth={maxWidth}>
          <HTML html={parsedHtmlBody} imagesMaxWidth={maxWidth} />
        </CommentBody>
      </Container>
    );
  }
}

export default CommentContent;
