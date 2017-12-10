import React, { Component } from 'react';
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
import SearchUserPreview from '../components/search/SearchUserPreview';

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.WHITE.WHITE};
`;

const ScrollView = styled.ScrollView``;

const Loading = styled.ActivityIndicator`
  margin-top: 10px;
`;

const SearchResult = styled.View``;

const SearchResultText = styled.Text``;

const mapStateToProps = state => ({
  tags: state.home.tags,
  searchResults: getSearchResults(state),
  searchLoading: getSearchLoading(state),
});

const mapDispatchToProps = dispatch => ({
  fetchTags: () => dispatch(fetchTags()),
  searchAskSteem: value => dispatch(searchAskSteem.action(value)),
});

class SearchScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    fetchTags: PropTypes.func.isRequired,
    searchAskSteem: PropTypes.func.isRequired,
    searchLoading: PropTypes.bool.isRequired,
    searchResults: PropTypes.array,
  };

  static defaultProps = {
    searchResults: [],
  };

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => <MaterialIcons name={'public'} size={20} color={tintColor} />,
  };

  constructor(props) {
    super(props);

    this.handleSearchOnChangeText = this.handleSearchOnChangeText.bind(this);
    this.handleOnClearText = this.handleOnClearText.bind(this);
  }
  componentDidMount() {
    this.props.fetchTags();
  }

  handleNavigateToFeed = tag => {
    this.props.navigation.navigate(navigationConstants.FEED, { tag });
  };

  handleSearchOnChangeText(value) {
    this.props.searchAskSteem(value);
  }

  handleOnClearText() {
    console.log('ON CLEAR TEXT');
  }

  renderSearchResults() {
    const { searchResults } = this.props;
    return _.map(searchResults, (result, index) => {
      switch (result.type) {
        case 'user': {
          const userKey = `${result.name}${index}`;
          return (
            <SearchUserPreview
              followersCount={result.followers_count}
              followingCount={result.following_count}
              key={userKey}
              postCount={result.post_count}
              username={result.name}
            />
          );
        }
        case 'post':
          const postKey = `${result.author}/${result.permlink}`;
          return (
            <SearchPostPreview
              author={result.author}
              key={postKey}
              summary={result.summary}
              tags={result.tags}
              title={result.title}
            />
          );
        default:
          return null;
      }
    });
  }
  render() {
    const { searchLoading } = this.props;
    return (
      <Container>
        <SearchBar
          lightTheme
          onChangeText={this.handleSearchOnChangeText}
          onClearText={this.handleOnClearText}
          placeholder=""
          containerStyle={{ backgroundColor: 'white', marginTop: 10 }}
          inputStyle={{ backgroundColor: 'white' }}
          showLoadingIcon={searchLoading}
        />
        <ScrollView>
          {this.renderSearchResults()}
        </ScrollView>

      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);

// {tags.map((tag, index) => (
// <TouchableTag onPress={() => this.handleNavigateToFeed(tag.name)} key={index}>
// <Tag>{`#${tag.name}`}</Tag>*
// </TouchableTag>*
// ))}
