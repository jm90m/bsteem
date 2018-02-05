import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import BodyShort from 'components/post-preview/BodyShort';
import _ from 'lodash';
import moment from 'moment';
import Tag from 'components/post/Tag';
import Avatar from 'components/common/Avatar';

const Container = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 5px;
  margin-bottom: 5px;
  border-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-width: 2px;
  padding: 10px;
`;

const AuthorContainer = styled.View`
  flex-direction: row;
`;

const AuthorContents = styled.View`
  margin-left: 5px;
`;

const AuthorText = styled.Text`
  font-weight: 700;
  color: ${COLORS.PRIMARY_COLOR};
`;

const PostTitle = styled.Text`
  padding-left: 5px;
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 20px;
`;

const TagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const TagContainer = styled.TouchableOpacity`
  margin: 3px 5px;
`;

const PostCreated = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
`;

class SearchPostPreview extends Component {
  static propTypes = {
    author: PropTypes.string,
    title: PropTypes.string,
    summary: PropTypes.string,
    permlink: PropTypes.string,
    created: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    handleNavigateToUserScreen: PropTypes.func,
    handleNavigateToFeedScreen: PropTypes.func,
    handleNavigateToPostScreen: PropTypes.func,
  };

  static defaultProps = {
    author: '',
    title: '',
    summary: '',
    permlink: '',
    created: '',
    tags: [],
    handleNavigateToUserScreen: () => {},
    handleNavigateToFeedScreen: () => {},
    handleNavigateToPostScreen: () => {},
  };

  constructor(props) {
    super(props);

    this.handleNavigateToUserScreen = this.handleNavigateToUserScreen.bind(this);
    this.handleNavigateToFeedScreen = this.handleNavigateToFeedScreen.bind(this);
    this.handleNavigateToPostScreen = this.handleNavigateToPostScreen.bind(this);
  }

  handleNavigateToUserScreen() {
    const { author } = this.props;
    this.props.handleNavigateToUserScreen(author);
  }

  handleNavigateToFeedScreen(tag) {
    this.props.handleNavigateToFeedScreen(tag);
  }

  handleNavigateToPostScreen() {
    const { author, permlink } = this.props;
    this.props.handleNavigateToPostScreen(author, permlink);
  }

  render() {
    const { author, title, summary, tags, created } = this.props;

    return (
      <Container>
        <AuthorContainer>
          <TouchableOpacity onPress={this.handleNavigateToUserScreen}>
            <Avatar username={author} size={40} />
          </TouchableOpacity>
          <AuthorContents>
            <TouchableOpacity onPress={this.handleNavigateToUserScreen}>
              <AuthorText>{`@${author}`}</AuthorText>
            </TouchableOpacity>
            <PostCreated>{moment(created).fromNow()}</PostCreated>
          </AuthorContents>
        </AuthorContainer>
        <TouchableOpacity onPress={this.handleNavigateToPostScreen}>
          <PostTitle>{title}</PostTitle>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleNavigateToPostScreen}>
          <BodyShort content={summary} />
        </TouchableOpacity>
        <TagsContainer>
          {_.map(tags, tag => (
            <TagContainer onPress={() => this.handleNavigateToFeedScreen(tag)} key={tag}>
              <Tag tag={tag} />
            </TagContainer>
          ))}
        </TagsContainer>
      </Container>
    );
  }
}

export default SearchPostPreview;
