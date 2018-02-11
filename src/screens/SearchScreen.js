import React, { Component } from 'react';
import { ListView } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';
import * as navigationConstants from 'constants/navigation';
import styled from 'styled-components/native';
import { fetchTags } from 'state/actions/homeActions';
import { searchAskSteem } from 'state/actions/searchActions';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import { getSearchResults, getSearchLoading, getIsAuthenticated } from 'state/rootReducer';
import SearchPostPreview from 'components/search/SearchPostPreview';
import SearchUserPreview from 'components/search/SearchUserPreview';
import SearchDefaultView from 'components/search/SearchDefaultView';

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.WHITE.WHITE};
  padding-top: 10px;
`;

const NoResultsFoundText = styled.Text`
  padding: 10px;
  justify-content: center;
`;

const StyledListView = styled.ListView`
  background-color: ${COLORS.LIST_VIEW_BACKGROUND};
`;

const Loading = styled.ActivityIndicator`
  padding: 10px;
`;

const mapStateToProps = state => ({
  authenticated: getIsAuthenticated(state),
  tags: state.home.tags,
  searchResults: getSearchResults(state),
  searchLoading: getSearchLoading(state),
});

const mapDispatchToProps = dispatch => ({
  fetchTags: () => dispatch(fetchTags()),
  searchAskSteem: value => dispatch(searchAskSteem.action(value)),
});

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class SearchScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    fetchTags: PropTypes.func.isRequired,
    searchAskSteem: PropTypes.func.isRequired,
    searchLoading: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool,
    searchResults: PropTypes.arrayOf(PropTypes.shape()),
    tags: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    searchResults: [],
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
    };

    this.handleSearchOnChangeText = this.handleSearchOnChangeText.bind(this);
    this.handleNavigateToFeed = this.handleNavigateToFeed.bind(this);
    this.handleNavigateToUserScreen = this.handleNavigateToUserScreen.bind(this);
    this.handleNavigateToPostScreen = this.handleNavigateToPostScreen.bind(this);
    this.renderSearchResultRow = this.renderSearchResultRow.bind(this);
    this.searchResultEndReached = this.searchResultEndReached.bind(this);
  }

  componentDidMount() {
    this.props.fetchTags();
  }

  handleNavigateToFeed(tag) {
    this.props.navigation.navigate(navigationConstants.FEED, { tag });
  }

  handleSearchOnChangeText(value) {
    this.setState(
      {
        currentSearchValue: value,
      },
      () => this.props.searchAskSteem(value),
    );
  }

  handleNavigateToUserScreen(username) {
    this.props.navigation.navigate(navigationConstants.USER, { username });
  }

  handleNavigateToPostScreen(author, permlink) {
    this.props.navigation.navigate(navigationConstants.FETCH_POST, { author, permlink });
  }

  searchResultEndReached() {}

  renderSearchResultRow(rowData) {
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
      default:
        return null;
    }
  }

  renderSearchDefaultView() {
    const { searchResults, tags, searchLoading } = this.props;
    const { currentSearchValue } = this.state;
    const hasNoSearchValue = _.isEmpty(currentSearchValue);
    const hasNoSearchResults = !_.isEmpty(currentSearchValue) && _.isEmpty(searchResults);

    if (searchLoading) {
      return <Loading color={COLORS.PRIMARY_COLOR} size="large" />;
    } else if (hasNoSearchValue) {
      return <SearchDefaultView handleNavigateToFeed={this.handleNavigateToFeed} tags={tags} />;
    } else if (hasNoSearchResults) {
      return <NoResultsFoundText>No results found for your search</NoResultsFoundText>;
    }

    return null;
  }

  render() {
    const { searchLoading, searchResults } = this.props;
    const { currentSearchValue } = this.state;
    const hasSearchResults = !_.isEmpty(searchResults) && !_.isEmpty(currentSearchValue);

    return (
      <Container>
        <SearchBar
          lightTheme
          onChangeText={this.handleSearchOnChangeText}
          placeholder=""
          value={currentSearchValue}
          containerStyle={{ backgroundColor: COLORS.WHITE.WHITE, marginTop: 10 }}
          inputStyle={{ backgroundColor: COLORS.WHITE.WHITE }}
          showLoadingIcon={searchLoading}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {hasSearchResults && (
          <StyledListView
            dataSource={ds.cloneWithRows(searchResults)}
            enableEmptySections
            renderRow={this.renderSearchResultRow}
            onEndReached={this.onEndReached}
          />
        )}
        {this.renderSearchDefaultView()}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
