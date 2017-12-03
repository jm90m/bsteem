import React, { Component } from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import steem from 'steem';
import moment from 'moment';
import { COLORS } from 'constants/styles';
import Tag from 'components/post/Tag';
import ReputationScore from 'components/post/ReputationScore';

const Container = styled.View`
  flex-direction: row;
  padding: 16px;
`;

const Avatar = styled.Image`
  height: 40px;
  width: 40px;
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

const Touchable = styled.TouchableOpacity``;

class Header extends Component {
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

  render() {
    const { postData } = this.props;

    const { category, author, author_reputation, created } = postData;
    return (
      <Container>
        <Avatar source={{ uri: `https://img.busy.org/@${author}?s=40` }} />
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
      </Container>
    );
  }
}

export default Header;
