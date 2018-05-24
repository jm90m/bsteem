import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import BodyShort from 'components/post-preview/BodyShort';
import _ from 'lodash';
import Tag from 'components/post/Tag';
import Avatar from 'components/common/Avatar';
import TimeAgo from 'components/common/TimeAgo';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import tinycolor from 'tinycolor2';

const Container = styled.View`
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  margin-top: 5px;
  margin-bottom: 5px;
  border-color: ${props => props.customTheme.primaryBorderColor};
  border-top-width: 2px;
  border-bottom-width: 2px;
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
  color: ${props => props.customTheme.primaryColor};
`;

const PostTitle = styled.Text`
  padding-left: 5px;
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 20px;
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const TagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const TagContainer = styled.TouchableOpacity`
  margin: 3px 5px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

class SearchPostPreview extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
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
    const { author, title, summary, tags, created, customTheme } = this.props;

    return (
      <Container customTheme={customTheme}>
        <AuthorContainer>
          <TouchableOpacity onPress={this.handleNavigateToUserScreen}>
            <Avatar username={author} size={40} />
          </TouchableOpacity>
          <AuthorContents>
            <TouchableOpacity onPress={this.handleNavigateToUserScreen}>
              <AuthorText customTheme={customTheme}>{`@${author}`}</AuthorText>
            </TouchableOpacity>
            <TimeAgo created={created} />
          </AuthorContents>
        </AuthorContainer>
        <TouchableOpacity onPress={this.handleNavigateToPostScreen}>
          <PostTitle customTheme={customTheme}>{title}</PostTitle>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleNavigateToPostScreen}>
          <BodyShort content={summary} />
        </TouchableOpacity>
        <TagsContainer>
          {_.map(_.uniq(tags), tag => (
            <TagContainer onPress={() => this.handleNavigateToFeedScreen(tag)} key={tag}>
              <Tag tag={tag} />
            </TagContainer>
          ))}
        </TagsContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(SearchPostPreview);
