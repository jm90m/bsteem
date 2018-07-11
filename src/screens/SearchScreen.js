import React, { Component } from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import * as navigationConstants from 'constants/navigation';
import { fetchTags } from 'state/actions/homeActions';
import * as searchActions from 'state/actions/searchActions';
import { COLORS } from 'constants/styles';
import commonStyles from 'styles/common';
import LargeLoading from 'components/common/LargeLoading';
import {
  getHomeTags,
  getAllTrendingTags,
  getSearchUsersResults,
  getSearchPostsResults,
  getSearchTagsResults,
  getLoadingSearchUser,
  getLoadingSearchPost,
  getLoadingSearchTag,
  getTagsLoading,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import SearchPostPreview from 'components/search/SearchPostPreview';
import SearchUserPreview from 'components/search/SearchUserPreview';
import SearchDefaultView from 'components/search/SearchDefaultView';
import SearchTagPreview from 'components/search/SearchTagPreview';
import SearchMenu from 'components/search/SearchMenu';
import StyledListView from 'components/common/StyledListView';
import PrimaryBackgroundView from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import tinycolor from 'tinycolor2';

const styles = StyleSheet.create({
  noResultsFoundText: {
    padding: 20,
    justifyContent: 'center',
    fontSize: 18,
  },
  loadingContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  tags: getHomeTags(state),
  allTrendingTags: getAllTrendingTags(state),
  searchUserResults: getSearchUsersResults(state),
  searchPostResults: getSearchPostsResults(state),
  searchTagsResults: getSearchTagsResults(state),
  loadingSearchUser: getLoadingSearchUser(state),
  loadingSearchPost: getLoadingSearchPost(state),
  loadingSearchTag: getLoadingSearchTag(state),
  tagsLoading: getTagsLoading(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  fetchTags: () => dispatch(fetchTags()),
  searchFetchPosts: value => dispatch(searchActions.searchFetchPosts.action(value)),
  searchFetchTags: value => dispatch(searchActions.searchFetchTags.action(value)),
  searchFetchUsers: value => dispatch(searchActions.searchFetchUsers.action(value)),
});

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class SearchScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    fetchTags: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape()),
    loadingSearchUser: PropTypes.bool.isRequired,
    loadingSearchPost: PropTypes.bool.isRequired,
    loadingSearchTag: PropTypes.bool.isRequired,
    tagsLoading: PropTypes.bool.isRequired,
    searchUserResults: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    searchPostResults: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    searchTagsResults: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    searchFetchPosts: PropTypes.func.isRequired,
    searchFetchTags: PropTypes.func.isRequired,
    searchFetchUsers: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tags: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      currentSearchValue: '',
      currentMenu: navigationConstants.SEARCH_MENU.USERS,
    };

    this.handleSearchOnChangeText = this.handleSearchOnChangeText.bind(this);
    this.handleNavigateToFeed = this.handleNavigateToFeed.bind(this);
    this.handleNavigateToUserScreen = this.handleNavigateToUserScreen.bind(this);
    this.handleNavigateToPostScreen = this.handleNavigateToPostScreen.bind(this);
    this.renderSearchResultRow = this.renderSearchResultRow.bind(this);
  }

  componentDidMount() {
    this.props.fetchTags();
  }

  handleSearchOnChangeText(value) {
    this.setState(
      {
        currentSearchValue: value,
      },
      () => {
        this.props.searchFetchPosts(value);
        this.props.searchFetchTags(value);
        this.props.searchFetchUsers(value);
      },
    );
  }

  handleNavigateToUserScreen(username) {
    this.props.navigation.push(navigationConstants.USER, { username });
  }

  handleNavigateToPostScreen(author, permlink) {
    this.props.navigation.push(navigationConstants.POST, { author, permlink });
  }

  handleSetCurrentMenu = currentMenu => () => {
    this.setState({
      currentMenu,
    });
  };

  handleNavigateToFeed(tag) {
    this.props.navigation.push(navigationConstants.FEED, { tag });
  }

  handleNavigateToFeedScreenForTagPreview = tag => () => {
    this.props.navigation.push(navigationConstants.FEED, { tag });
  };

  renderSearchResultRow(rowData, key, index) {
    const isFirstElement = index === '0' || index === 0;
    switch (rowData.type) {
      case 'user': {
        return (
          <SearchUserPreview
            username={rowData.name}
            handleNavigateToUserScreen={this.handleNavigateToUserScreen}
            isFirstElement={isFirstElement}
          />
        );
      }
      case 'post': {
        return (
          <SearchPostPreview
            author={rowData.author}
            summary={rowData.summary}
            tags={rowData.tags}
            title={rowData.title}
            permlink={rowData.permlink}
            created={rowData.created}
            handleNavigateToUserScreen={this.handleNavigateToUserScreen}
            handleNavigateToFeedScreen={this.handleNavigateToFeed}
            handleNavigateToPostScreen={this.handleNavigateToPostScreen}
            isFirstElement={isFirstElement}
          />
        );
      }
      case 'tag': {
        const tag = rowData.name;
        return (
          <SearchTagPreview
            tag={tag}
            isFirstElement={isFirstElement}
            handleNavigateToFeed={this.handleNavigateToFeedScreenForTagPreview}
          />
        );
      }
      default:
        return null;
    }
  }

  renderDefaultsViews(isLoading, hasNoSearchValue, hasNoSearchResults) {
    const { tags, tagsLoading, intl } = this.props;
    if (isLoading) {
      return this.renderLoader();
    } else if (hasNoSearchValue) {
      return (
        <SearchDefaultView
          handleNavigateToFeed={this.handleNavigateToFeed}
          tags={tags}
          tagsLoading={tagsLoading}
          fetchTags={this.props.fetchTags}
        />
      );
    } else if (hasNoSearchResults) {
      return (
        <StyledTextByBackground style={styles.noResultsFoundText}>
          {intl.no_search_results_found}
        </StyledTextByBackground>
      );
    }
    return null;
  }

  renderSearchDefaultView() {
    const {
      loadingSearchUser,
      loadingSearchPost,
      loadingSearchTag,
      searchUserResults,
      searchPostResults,
      searchTagsResults,
    } = this.props;
    const { currentSearchValue, currentMenu } = this.state;
    const hasNoSearchValue = _.isEmpty(currentSearchValue);
    let hasNoSearchResult;

    switch (currentMenu) {
      case navigationConstants.SEARCH_MENU.TAGS:
        hasNoSearchResult = _.isEmpty(searchTagsResults);
        return this.renderDefaultsViews(loadingSearchTag, hasNoSearchValue, hasNoSearchResult);
      case navigationConstants.SEARCH_MENU.POSTS:
        hasNoSearchResult = _.isEmpty(searchPostResults);
        return this.renderDefaultsViews(loadingSearchPost, hasNoSearchValue, hasNoSearchResult);
      case navigationConstants.SEARCH_MENU.USERS:
      default:
        hasNoSearchResult = _.isEmpty(searchUserResults);
        return this.renderDefaultsViews(loadingSearchUser, hasNoSearchValue, hasNoSearchResult);
    }
  }

  renderMenu() {
    const { currentMenu } = this.state;
    const selectedUsers = _.isEqual(currentMenu, navigationConstants.SEARCH_MENU.USERS);
    const selectedTags = _.isEqual(currentMenu, navigationConstants.SEARCH_MENU.TAGS);
    const selectedPosts = _.isEqual(currentMenu, navigationConstants.SEARCH_MENU.POSTS);

    return (
      <SearchMenu
        handleSetCurrentMenu={this.handleSetCurrentMenu}
        selectedUsers={selectedUsers}
        selectedTags={selectedTags}
        selectedPosts={selectedPosts}
      />
    );
  }

  renderLoader() {
    const { loadingSearchUser, loadingSearchPost, loadingSearchTag } = this.props;
    const { currentMenu } = this.state;
    switch (currentMenu) {
      case navigationConstants.SEARCH_MENU.TAGS:
        return (
          loadingSearchTag && (
            <View style={styles.loadingContainer}>
              <LargeLoading />
            </View>
          )
        );
      case navigationConstants.SEARCH_MENU.POSTS:
        return (
          loadingSearchPost && (
            <View style={styles.loadingContainer}>
              <LargeLoading />
            </View>
          )
        );
      case navigationConstants.SEARCH_MENU.USERS:
      default:
        return (
          loadingSearchUser && (
            <View style={styles.loadingContainer}>
              <LargeLoading />
            </View>
          )
        );
    }
  }

  renderSearchResults() {
    const { searchUserResults, searchPostResults, searchTagsResults } = this.props;
    const { currentMenu, currentSearchValue } = this.state;

    switch (currentMenu) {
      case navigationConstants.SEARCH_MENU.TAGS: {
        const hasSearchResults = !_.isEmpty(searchTagsResults) && !_.isEmpty(currentSearchValue);
        return (
          hasSearchResults && (
            <StyledListView
              dataSource={ds.cloneWithRows(searchTagsResults)}
              enableEmptySections
              renderRow={this.renderSearchResultRow}
            />
          )
        );
      }
      case navigationConstants.SEARCH_MENU.POSTS: {
        const hasSearchResults = !_.isEmpty(searchPostResults) && !_.isEmpty(currentSearchValue);
        return (
          hasSearchResults && (
            <StyledListView
              dataSource={ds.cloneWithRows(searchPostResults)}
              enableEmptySections
              renderRow={this.renderSearchResultRow}
            />
          )
        );
      }
      case navigationConstants.SEARCH_MENU.USERS:
      default: {
        const hasSearchResults = !_.isEmpty(searchUserResults) && !_.isEmpty(currentSearchValue);
        return (
          hasSearchResults && (
            <StyledListView
              dataSource={ds.cloneWithRows(searchUserResults)}
              enableEmptySections
              renderRow={this.renderSearchResultRow}
            />
          )
        );
      }
    }
  }

  render() {
    const { searchUserResults, searchPostResults, searchTagsResults, customTheme } = this.props;
    const { currentSearchValue } = this.state;
    const hasSearchResults =
      !_.isEmpty(searchUserResults) ||
      !_.isEmpty(searchPostResults) ||
      !_.isEmpty(searchTagsResults);
    const displayMenu = hasSearchResults && !_.isEmpty(currentSearchValue);
    const color = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;
    const containerStyles = [
      commonStyles.container,
      { paddingTop: 10, backgroundColor: customTheme.primaryBackgroundColor },
    ];
    const searchContainerStyles = {
      backgroundColor: customTheme.primaryBackgroundColor,
      marginTop: 10,
    };
    const searchInputStyle = {
      backgroundColor: customTheme.primaryBackgroundColor,
      color,
    };

    return (
      <PrimaryBackgroundView style={containerStyles}>
        <SearchBar
          lightTheme
          onChangeText={this.handleSearchOnChangeText}
          placeholder=""
          value={currentSearchValue}
          containerStyle={searchContainerStyles}
          inputStyle={searchInputStyle}
          autoCorrect={false}
          autoCapitalize="none"
          clearIcon
        />
        {displayMenu && this.renderMenu()}
        {this.renderSearchResults()}
        {this.renderSearchDefaultView()}
      </PrimaryBackgroundView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
