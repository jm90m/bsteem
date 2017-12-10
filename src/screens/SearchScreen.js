import React, { Component } from 'react';
import { ListView } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import * as navigationConstants from 'constants/navigation';
import styled from 'styled-components/native';
import { fetchTags } from 'state/actions/homeActions';
import { searchAskSteem } from 'state/actions/searchActions';
import { COLORS } from 'constants/styles';
import { getSearchResults, getSearchLoading } from 'state/rootReducer';
import SearchPostPreview from 'components/search/SearchPostPreview';
import SearchUserPreview from 'components/search/SearchUserPreview';
import SearchDefaultView from 'components/search/SearchDefaultView';

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.WHITE.WHITE};
`;

const ScrollView = styled.ScrollView`
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const StyledListView = styled.ListView`
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const mapStateToProps = state => ({
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
    searchResults: PropTypes.arrayOf(PropTypes.shape()),
    tags: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    searchResults: [],
    tags: [],
  };

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => <MaterialIcons name="public" size={20} color={tintColor} />,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentSearchValue: '',
    };

    this.handleSearchOnChangeText = this.handleSearchOnChangeText.bind(this);
    this.handleNavigateToFeed = this.handleNavigateToFeed.bind(this);
    this.handleNavigateToUserScreen = this.handleNavigateToUserScreen.bind(this);
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
            handleNavigateToUserScreen={this.handleNavigateToUserScreen}
          />
        );
      }
      default:
        return null;
    }
  }

  renderSearchDefaultView() {
    const { searchResults, tags } = this.props;

    if (_.isEmpty(searchResults)) {
      return <SearchDefaultView handleNavigateToFeed={this.handleNavigateToFeed} tags={tags} />;
    }

    return null;
  }

  render() {
    const { searchLoading, searchResults } = this.props;
    const { currentSearchValue } = this.state;
    const hasSearchResults = !_.isEmpty(searchResults);
    return (
      <Container>
        <SearchBar
          lightTheme
          onChangeText={this.handleSearchOnChangeText}
          placeholder=""
          value={currentSearchValue}
          containerStyle={{ backgroundColor: 'white', marginTop: 10 }}
          inputStyle={{ backgroundColor: 'white' }}
          showLoadingIcon={searchLoading}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {hasSearchResults &&
          <StyledListView
            dataSource={ds.cloneWithRows(searchResults)}
            enableEmptySections
            renderRow={this.renderSearchResultRow}
            onEndReached={this.onEndReached}
          />}
        {this.renderSearchDefaultView()}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
