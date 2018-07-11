import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, View } from 'react-native';
import { COLORS } from 'constants/styles';
import commonStyles from 'styles/common';
import BodyShort from 'components/post-preview/BodyShort';
import Touchable from 'components/common/Touchable';
import _ from 'lodash';
import Tag from 'components/post/Tag';
import Avatar from 'components/common/Avatar';
import TimeAgo from 'components/common/TimeAgo';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import tinycolor from 'tinycolor2';

const styles = StyleSheet.create({
  searchPostPreviewContainer: {
    borderBottomWidth: 1,
    padding: 10,
  },
  authorContents: {
    marginLeft: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginVertical: 3,
    marginHorizontal: 5,
  },
});

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
    isFirstElement: PropTypes.bool,
  };

  static defaultProps = {
    isFirstElement: false,
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
    this.handleNavigateToPostScreen = this.handleNavigateToPostScreen.bind(this);
  }

  handleNavigateToUserScreen() {
    const { author } = this.props;
    this.props.handleNavigateToUserScreen(author);
  }

  handleNavigateToFeedScreen = tag => () => {
    this.props.handleNavigateToFeedScreen(tag);
  };

  handleNavigateToPostScreen() {
    const { author, permlink } = this.props;
    this.props.handleNavigateToPostScreen(author, permlink);
  }

  render() {
    const { author, title, summary, tags, created, customTheme, isFirstElement } = this.props;
    const textColorStyle = {
      color: tinycolor(customTheme.primaryBackgroundColor).isDark()
        ? COLORS.LIGHT_TEXT_COLOR
        : COLORS.DARK_TEXT_COLOR,
    };
    const containerStyles = [
      styles.searchPostPreviewContainer,
      {
        backgroundColor: customTheme.primaryBackgroundColor,
        borderColor: customTheme.primaryBorderColor,
        borderTopWidth: isFirstElement ? 1 : 0,
      },
    ];
    const postTitleStyles = [commonStyles.postTitle, textColorStyle];
    const postAuthorStyle = {
      color: customTheme.primaryColor,
    };

    return (
      <View style={containerStyles}>
        <View style={commonStyles.rowContainer}>
          <Touchable onPress={this.handleNavigateToUserScreen}>
            <View>
              <Avatar username={author} size={40} />
            </View>
          </Touchable>
          <View style={styles.authorContents}>
            <Touchable onPress={this.handleNavigateToUserScreen}>
              <View>
                <Text style={postAuthorStyle}>{`${author}`}</Text>
              </View>
            </Touchable>
            <TimeAgo created={created} />
          </View>
        </View>
        <Touchable onPress={this.handleNavigateToPostScreen}>
          <View>
            <Text style={postTitleStyles}>{title}</Text>
          </View>
        </Touchable>
        <Touchable onPress={this.handleNavigateToPostScreen}>
          <View>
            <BodyShort content={summary} />
          </View>
        </Touchable>
        <View style={styles.tagsContainer}>
          {_.map(_.uniq(tags), tag => (
            <Touchable onPress={this.handleNavigateToFeedScreen(tag)} key={tag}>
              <View style={styles.tag}>
                <Tag tag={tag} />
              </View>
            </Touchable>
          ))}
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(SearchPostPreview);
