import React, { Component } from 'react';
import { ListView } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import * as navigationConstants from 'constants/navigation';
import styled from 'styled-components/native';
import { fetchTags } from 'state/actions/homeActions';
import * as searchActions from 'state/actions/searchActions';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import LargeLoading from 'components/common/LargeLoading';
import { abbreviateLargeNumber } from 'util/numberFormatter';
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
import Tag from 'components/post/Tag';
import SaveTagButton from 'components/common/SaveTagButton';
import StyledListView from 'components/common/StyledListView';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import tinycolor from 'tinycolor2';

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
  padding-top: 10px;
`;

const NoResultsFoundText = styled(StyledTextByBackground)`
  padding: 20px;
  justify-content: center;
  font-size: 18px;
`;

const Menu = styled.View`
  justify-content: space-around;
  flex-direction: row;
`;

const MenuContent = styled.View`
  flex-direction: row;
  padding: 10px 0;
  border-bottom-width: 2px;
  border-bottom-color: ${props =>
    props.selected ? props.customTheme.primaryColor : 'transparent'};
  width: 50px;
  justify-content: center;
`;

const LoadingContainer = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const Count = styled.Text`
  margin-left: 5px;
  color: ${props =>
    props.selected ? props.customTheme.primaryColor : props.customTheme.secondaryColor};
  font-size: 18px;
`;

const TouchableMenu = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

const TagOption = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  margin: 5px 0;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const TagTouchble = styled.TouchableOpacity``;

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

const MENU = {
  USERS: 'USERS',
  TAGS: 'TAGS',
  POSTS: 'POSTS',
};

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

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <MaterialIcons name={MATERIAL_ICONS.search} size={20} color={tintColor} />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      currentSearchValue: '',
      currentMenu: MENU.USERS,
    };

    this.handleSearchOnChangeText = this.handleSearchOnChangeText.bind(this);
    this.handleNavigateToFeed = this.handleNavigateToFeed.bind(this);
    this.handleNavigateToUserScreen = this.handleNavigateToUserScreen.bind(this);
    this.handleNavigateToPostScreen = this.handleNavigateToPostScreen.bind(this);
    this.renderSearchResultRow = this.renderSearchResultRow.bind(this);
    this.setCurrentMenu = this.setCurrentMenu.bind(this);
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
    this.props.navigation.navigate(navigationConstants.USER, { username });
  }

  handleNavigateToPostScreen(author, permlink) {
    this.props.navigation.navigate(navigationConstants.FETCH_POST, { author, permlink });
  }

  setCurrentMenu(currentMenu) {
    this.setState({
      currentMenu,
    });
  }

  handleNavigateToFeed(tag) {
    this.props.navigation.navigate(navigationConstants.FEED, { tag });
  }

  renderSearchResultRow(rowData) {
    const { customTheme } = this.props;
    switch (rowData.type) {
      case 'user': {
        return (
          <SearchUserPreview
            username={rowData.name}
            handleNavigateToUserScreen={this.handleNavigateToUserScreen}
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
          />
        );
      }
      case 'tag': {
        const tag = rowData.name;
        return (
          <TagOption customTheme={customTheme}>
            <TagTouchble onPress={() => this.handleNavigateToFeed(tag)}>
              <Tag tag={tag} />
            </TagTouchble>
            <SaveTagButton tag={tag} />
          </TagOption>
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
      return <NoResultsFoundText>{intl.no_search_results_found}</NoResultsFoundText>;
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
      case MENU.TAGS:
        hasNoSearchResult = _.isEmpty(searchTagsResults);
        return this.renderDefaultsViews(loadingSearchTag, hasNoSearchValue, hasNoSearchResult);
      case MENU.POSTS:
        hasNoSearchResult = _.isEmpty(searchPostResults);
        return this.renderDefaultsViews(loadingSearchPost, hasNoSearchValue, hasNoSearchResult);
      case MENU.USERS:
      default:
        hasNoSearchResult = _.isEmpty(searchUserResults);
        return this.renderDefaultsViews(loadingSearchUser, hasNoSearchValue, hasNoSearchResult);
    }
  }

  renderMenu() {
    const { searchUserResults, searchPostResults, searchTagsResults, customTheme } = this.props;
    const { currentMenu } = this.state;
    const selectedUsers = _.isEqual(currentMenu, MENU.USERS);
    const selectedTags = _.isEqual(currentMenu, MENU.TAGS);
    const selectedPosts = _.isEqual(currentMenu, MENU.POSTS);

    return (
      <Menu>
        <TouchableMenu onPress={() => this.setCurrentMenu(MENU.TAGS)}>
          <MenuContent selected={selectedTags} customTheme={customTheme}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.tag}
              size={ICON_SIZES.menuIcon}
              color={selectedTags ? customTheme.primaryColor : customTheme.secondaryColor}
            />
            <Count selected={selectedTags} customTheme={customTheme}>
              {abbreviateLargeNumber(_.size(searchTagsResults))}
            </Count>
          </MenuContent>
        </TouchableMenu>
        <TouchableMenu onPress={() => this.setCurrentMenu(MENU.USERS)}>
          <MenuContent selected={selectedUsers} customTheme={customTheme}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.account}
              size={ICON_SIZES.menuIcon}
              color={selectedUsers ? customTheme.primaryColor : customTheme.secondaryColor}
            />
            <Count selected={selectedUsers} customTheme={customTheme}>
              {abbreviateLargeNumber(_.size(searchUserResults))}
            </Count>
          </MenuContent>
        </TouchableMenu>
        <TouchableMenu onPress={() => this.setCurrentMenu(MENU.POSTS)}>
          <MenuContent selected={selectedPosts} customTheme={customTheme}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.posts}
              size={ICON_SIZES.menuIcon}
              color={selectedPosts ? customTheme.primaryColor : customTheme.secondaryColor}
            />
            <Count selected={selectedPosts} customTheme={customTheme}>
              {abbreviateLargeNumber(_.size(searchPostResults))}
            </Count>
          </MenuContent>
        </TouchableMenu>
      </Menu>
    );
  }

  renderLoader() {
    const { loadingSearchUser, loadingSearchPost, loadingSearchTag } = this.props;
    const { currentMenu } = this.state;
    switch (currentMenu) {
      case MENU.TAGS:
        return (
          loadingSearchTag && (
            <LoadingContainer>
              <LargeLoading />
            </LoadingContainer>
          )
        );
      case MENU.POSTS:
        return (
          loadingSearchPost && (
            <LoadingContainer>
              <LargeLoading />
            </LoadingContainer>
          )
        );
      case MENU.USERS:
      default:
        return (
          loadingSearchUser && (
            <LoadingContainer>
              <LargeLoading />
            </LoadingContainer>
          )
        );
    }
  }

  renderSearchResults() {
    const { searchUserResults, searchPostResults, searchTagsResults } = this.props;
    const { currentMenu, currentSearchValue } = this.state;

    switch (currentMenu) {
      case MENU.TAGS: {
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
      case MENU.POSTS: {
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
      case MENU.USERS:
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
    const {
      searchLoading,
      searchUserResults,
      searchPostResults,
      searchTagsResults,
      customTheme,
    } = this.props;
    const { currentSearchValue } = this.state;
    const hasSearchResults =
      !_.isEmpty(searchUserResults) ||
      !_.isEmpty(searchPostResults) ||
      !_.isEmpty(searchTagsResults);
    const displayMenu = hasSearchResults && !_.isEmpty(currentSearchValue);
    const color = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;
    return (
      <Container>
        <SearchBar
          lightTheme
          onChangeText={this.handleSearchOnChangeText}
          placeholder=""
          value={currentSearchValue}
          containerStyle={{ backgroundColor: customTheme.primaryBackgroundColor, marginTop: 10 }}
          inputStyle={{ backgroundColor: customTheme.primaryBackgroundColor, color }}
          showLoadingIcon={searchLoading}
          autoCorrect={false}
          autoCapitalize="none"
          clearIcon
        />
        {displayMenu && this.renderMenu()}
        {this.renderSearchResults()}
        {this.renderSearchDefaultView()}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
