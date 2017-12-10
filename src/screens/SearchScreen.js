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

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.WHITE.WHITE};
`;

const ScrollView = styled.ScrollView``;

const Tag = styled.Text`
`;

const Loading = styled.ActivityIndicator`
  margin-top: 10px;
`;

const TouchableTag = styled.TouchableOpacity`
  padding: 5px;
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

    return _.map(searchResults, result => (
      <SearchResult key={`${result.author}/${result.permlink}`}>
        <SearchResultText>{result.title}</SearchResultText>
      </SearchResult>
    ));
  }
  render() {
    const { tags, searchLoading, searchResults } = this.props;
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
