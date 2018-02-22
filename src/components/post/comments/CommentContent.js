import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import _ from 'lodash';
import Expo from 'expo';
import { COLORS } from 'constants/styles';
import TimeAgo from 'components/common/TimeAgo';
import HTML from 'react-native-render-html';
import ReputationScore from '../ReputationScore';
import { getHtml } from '../../../util/postUtils';
import { POST_HTML_BODY_TAG, POST_HTML_BODY_USER } from '../../../constants/postConstants';
import * as navigationConstants from '../../../constants/navigation';

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
    navigation: PropTypes.shape().isRequired,
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

  constructor(props) {
    super(props);

    this.navigateToUser = this.navigateToUser.bind(this);
    this.navigateToFeed = this.navigateToFeed.bind(this);
    this.handleLinkPress = this.handleLinkPress.bind(this);
  }

  navigateToUser(username) {
    this.props.navigation.navigate(navigationConstants.USER, { username });
  }

  navigateToFeed(tag) {
    this.props.navigation.navigate(navigationConstants.FEED, { tag });
  }

  handleLinkPress(e, url) {
    console.log('clicked link: ', url);
    const isTag = _.includes(url, POST_HTML_BODY_TAG);
    const isUser = _.includes(url, POST_HTML_BODY_USER);

    if (isUser) {
      const user = _.get(_.split(url, POST_HTML_BODY_USER), 1, 'bsteem');
      this.navigateToUser(user);
    } else if (isTag) {
      const tag = _.get(_.split(url, POST_HTML_BODY_TAG), 1, 'bsteem');
      this.navigateToFeed(tag);
    } else {
      Expo.WebBrowser.openBrowserAsync(url).catch(error => {
        console.log('invalid url', error, url);
      });
    }
  }

  render() {
    const { username, reputation, created, body, depth, currentWidth } = this.props;
    const bodyWidthPadding = depth === 1 ? 70 : 100;
    const maxWidth = currentWidth - bodyWidthPadding;
    const parsedHtmlBody = getHtml(body, {});

    return (
      <Container>
        <HeaderContent>
          <Header>
            <TouchableOpacity onPress={() => this.navigateToUser(username)}>
              <Username>{username}</Username>
            </TouchableOpacity>
            <TimeAgo created={created} />
          </Header>
          <ReputationScore reputation={reputation} />
        </HeaderContent>
        <CommentBody maxWidth={maxWidth}>
          <HTML
            html={parsedHtmlBody}
            imagesMaxWidth={maxWidth}
            onLinkPress={this.handleLinkPress}
          />
        </CommentBody>
      </Container>
    );
  }
}

export default CommentContent;
