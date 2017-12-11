import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import BodyShort from 'components/post-preview/BodyShort';
import _ from 'lodash';
import Tag from 'components/post/Tag';

const Container = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 5px;
  margin-bottom: 5px;
  border-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-width: 2px;
  padding: 5px;
`;

const AuthorText = styled.Text`
  font-weight: 700;
  color: ${COLORS.BLUE.MARINER};
  padding: 0 5px;
`;

const PostTitle = styled.Text`
  padding-left: 5px;
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 20px;
`;

const TagsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const TagContainer = styled.TouchableOpacity`
  margin: 3px 5px;
`;

class SearchPostPreview extends Component {
  static propTypes = {
    author: PropTypes.string,
    title: PropTypes.string,
    summary: PropTypes.string,
    permlink: PropTypes.string,
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
    const { author, title, summary, tags } = this.props;

    return (
      <Container>
        <TouchableOpacity onPress={this.handleNavigateToPostScreen}>
          <PostTitle>{title}</PostTitle>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleNavigateToUserScreen}>
          <AuthorText>{`@${author}`}</AuthorText>
        </TouchableOpacity>
        <TouchableOpacity onPRess={this.handleNavigateToPostScreen}>
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
