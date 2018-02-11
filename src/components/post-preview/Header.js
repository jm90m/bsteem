import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { getReputation } from 'util/steemitFormatters';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment-timezone';
import APPS from 'constants/apps';
import { COLORS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import Tag from 'components/post/Tag';
import * as navigationConstants from 'constants/navigation';
import ReputationScore from 'components/post/ReputationScore';
import Avatar from 'components/common/Avatar';
import TimeAgo from 'components/common/TimeAgo';

const Container = styled.View`
  padding: 16px 5px;
  padding-bottom: 0;
`;

const UserHeaderContainer = styled.View`
  flex-direction: row;
`;

const Author = styled.View`
  flex-direction: row;
`;
const AuthorText = styled.Text`
  font-weight: 700;
  color: ${COLORS.PRIMARY_COLOR};
`;
const HeaderContents = styled.View`
  margin: 0 12px;
`;

const RebloggedUsername = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
`;
const RebloggedText = styled.Text`
  color: ${props => (props.color ? props.color : COLORS.BLUE.LINK_WATER)};
`;

const Reblogged = styled.View`
  flex-direction: row;
  padding: 10px 0;
`;

const Touchable = styled.TouchableOpacity``;

const TagContainer = styled.View`
  padding: 5px 0;
  flex-direction: row;
  align-items: center;
`;

const PostedFrom = styled.Text`
  margin-left: 10px;
  color: ${COLORS.TERTIARY_COLOR};
`;

class Header extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    postData: PropTypes.shape().isRequired,
    currentUsername: PropTypes.string,
    displayMenu: PropTypes.func,
  };

  static defaultProps = {
    currentUsername: '',
    displayMenu: () => {},
  };

  constructor(props) {
    super(props);

    this.handleUserNavigation = this.handleUserNavigation.bind(this);
    this.handleFeedNavigation = this.handleFeedNavigation.bind(this);
    this.handleReblogUserNavigation = this.handleReblogUserNavigation.bind(this);
  }

  handleUserNavigation() {
    const { navigation, postData } = this.props;
    const { author } = postData;
    navigation.navigate(navigationConstants.USER, { username: author });
  }

  handleReblogUserNavigation() {
    const { navigation, postData } = this.props;
    const { first_reblogged_by } = postData;
    navigation.navigate(navigationConstants.USER, { username: first_reblogged_by });
  }

  handleFeedNavigation() {
    const { navigation, postData } = this.props;
    const { category } = postData;

    navigation.navigate(navigationConstants.FEED, { tag: category });
  }

  renderReblogged() {
    const { postData } = this.props;
    if (postData.first_reblogged_by) {
      return (
        <Reblogged>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.reblog}
            size={20}
            color={COLORS.BLUE.LINK_WATER}
            style={{ marginRight: 5 }}
          />
          <Touchable onPress={this.handleReblogUserNavigation}>
            <RebloggedUsername>{postData.first_reblogged_by}</RebloggedUsername>
          </Touchable>
          <RebloggedText>{' reblogged'}</RebloggedText>
        </Reblogged>
      );
    } else if (postData.first_reblogged_on) {
      console.log('POST_DATA FIRST REBLOGGED ON', postData.first_reblogged_on);
      console.log('POST DATA', postData);
      return (
        <Reblogged>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.reblog}
            size={20}
            color={COLORS.BLUE.LINK_WATER}
            style={{ marginRight: 5 }}
          />
          <RebloggedText>Reblogged</RebloggedText>
        </Reblogged>
      );
    }
    return null;
  }

  renderAuthor() {
    const { currentUsername, postData } = this.props;
    const { author } = postData;
    if (currentUsername === author) {
      return <AuthorText>{author}</AuthorText>;
    }
    return (
      <Touchable onPress={this.handleUserNavigation}>
        <AuthorText>{author}</AuthorText>
      </Touchable>
    );
  }

  renderPostedFrom() {
    try {
      const { postData } = this.props;
      const app = JSON.parse(postData.json_metadata).app.split('/');
      const from = APPS[app[0]];
      // version = app[1];
      return <PostedFrom>{from}</PostedFrom>;
    } catch (e) {
      return <View />;
    }
  }
  render() {
    const { postData, displayMenu } = this.props;

    const { category, author, author_reputation, created } = postData;
    return (
      <Container>
        {this.renderReblogged()}
        <UserHeaderContainer>
          <Avatar username={author} size={40} />
          <HeaderContents>
            <Author>
              <View>
                {this.renderAuthor()}
                <TimeAgo created={created} />
              </View>
              <ReputationScore reputation={getReputation(author_reputation)} />
            </Author>
          </HeaderContents>
          <Touchable
            onPress={displayMenu}
            style={{ marginLeft: 'auto', paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}
          >
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.menuHorizontal}
              size={ICON_SIZES.menuIcon}
              color={COLORS.PRIMARY_COLOR}
            />
          </Touchable>
        </UserHeaderContainer>
        <TagContainer>
          <Touchable onPress={this.handleFeedNavigation}>
            <Tag tag={category} />
          </Touchable>
          {this.renderPostedFrom()}
        </TagContainer>
      </Container>
    );
  }
}

export default Header;
