import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { getReputation } from 'util/steemitFormatters';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { COLORS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import Tag from 'components/post/Tag';
import * as navigationConstants from 'constants/navigation';
import ReputationScore from 'components/post/ReputationScore';
import Avatar from 'components/common/Avatar';

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
  color: ${COLORS.BLUE.MARINER};
`;
const HeaderContents = styled.View`
  margin: 0 12px;
`;

const PostCreated = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
`;

const RebloggedUsername = styled.Text`
  color: ${COLORS.BLUE.MARINER};
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
  justify-content: space-between;
  flex-direction: row;
`;

const EmptyView = styled.View`
  width: 3px;
`;

class Header extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    postData: PropTypes.shape().isRequired,
    currentUsername: PropTypes.string,
  };

  static defaultProps = {
    currentUsername: '',
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
  render() {
    const { postData } = this.props;

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
                <PostCreated>{`${moment(created).fromNow(true)} ago`}</PostCreated>
              </View>
              <ReputationScore reputation={getReputation(author_reputation)} />
            </Author>
          </HeaderContents>
        </UserHeaderContainer>
        <TagContainer>
          <Touchable onPress={this.handleFeedNavigation}>
            <Tag tag={category} />
          </Touchable>
          <EmptyView />
        </TagContainer>
      </Container>
    );
  }
}

export default Header;
