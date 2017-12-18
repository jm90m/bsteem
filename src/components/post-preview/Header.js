import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View } from 'react-native';
import steem from 'steem';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { COLORS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import Tag from 'components/post/Tag';
import ReputationScore from 'components/post/ReputationScore';
import Avatar from 'components/common/Avatar';

const Container = styled.View`
  padding: 16px;
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

const RebloggedText = styled.Text`
  color: ${COLORS.BLUE.LINK_WATER};
`;

const Reblogged = styled.View`
  flex-direction: row;
`;

const Touchable = styled.TouchableOpacity``;

class Header extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    postData: PropTypes.shape().isRequired,
  };

  handleUserNavigation = () => {
    const { navigation, postData } = this.props;
    const { author } = postData;

    navigation.navigate('USER', { username: author });
  };

  handleFeedNavigation = () => {
    const { navigation, postData } = this.props;
    const { category } = postData;

    navigation.navigate('FEED', { tag: category });
  };

  renderReblogged() {
    const { postData } = this.props;
    if (postData.first_reblogged_by) {
      return (
        <Reblogged>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.reblog}
            size={20}
            color={COLORS.BLUE.LINK_WATER}
          />
          <RebloggedText>{`${postData.first_reblogged_by} reblogged`}</RebloggedText>
        </Reblogged>
      );
    } else if (postData.first_reblogged_on) {
      return <RebloggedText>Reblogged</RebloggedText>;
    }
    return null;
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
                <Touchable onPress={this.handleUserNavigation}>
                  <AuthorText>{author}</AuthorText>
                </Touchable>
                <PostCreated>{moment(created).fromNow()}</PostCreated>
              </View>
              <ReputationScore reputation={steem.formatter.reputation(author_reputation)} />
            </Author>
          </HeaderContents>
          <Touchable onPress={this.handleFeedNavigation}>
            <Tag tag={category} />
          </Touchable>
        </UserHeaderContainer>
      </Container>
    );
  }
}

export default Header;
