import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import { COLORS } from 'constants/styles';
import { connect } from 'react-redux';
import {
  getCurrentUserFeed,
  getLoadingFetchCurrentUserFeed,
  getLoadingFetchMoreCurrentUserFeed,
  getAuthUsername,
} from 'state/rootReducer';
import { currentUserFeedFetch, currentUserFeedFetchMore } from 'state/actions/currentUserActions';
import PostPreview from 'components/post-preview/PostPreview';
import LargeLoading from 'components/common/LargeLoadingCenter';
import i18n from '../../i18n/i18n';

const Container = styled.View`
  flex: 1;
`;

const StyledFlatList = styled.FlatList`
  flex: 1;
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const LoadingContainer = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const EmptyContainer = styled.View`
  margin: 5px 0;
  padding: 20px;
  background-color: ${COLORS.WHITE.WHITE};
`;

const EmptyText = styled.Text``;

const mapStateToProps = state => ({
  currentAuthUsername: getAuthUsername(state),
  currentUserFeed: getCurrentUserFeed(state),
  loadingFetchCurrentUserFeed: getLoadingFetchCurrentUserFeed(state),
  loadingFetchMoreCurrentUserFeed: getLoadingFetchMoreCurrentUserFeed(state),
});

const mapDispatchToProps = dispatch => ({
  currentUserFeedFetch: () => dispatch(currentUserFeedFetch.action()),
  currentUserFeedFetchMore: () => dispatch(currentUserFeedFetchMore.action()),
});

class CurrentUserFeed extends Component {
  static propTypes = {
    currentUserFeed: PropTypes.arrayOf(PropTypes.shape()),
    loadingFetchCurrentUserFeed: PropTypes.bool.isRequired,
    loadingFetchMoreCurrentUserFeed: PropTypes.bool.isRequired,
    currentUserFeedFetch: PropTypes.func.isRequired,
    currentUserFeedFetchMore: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    hideFeed: PropTypes.bool,
  };

  static defaultProps = {
    currentUserFeed: [],
    hideFeed: false,
  };

  constructor(props) {
    super(props);

    this.onRefreshCurrentFeed = this.onRefreshCurrentFeed.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderLoader = this.renderLoader.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
  }

  componentDidMount() {
    if (_.isEmpty(this.props.currentUserFeed)) {
      this.props.currentUserFeedFetch();
    }
  }

  componentWillReceiveProps() {
    if (_.isEmpty(this.props.currentUserFeed)) {
      this.props.currentUserFeedFetch();
    }
  }

  onRefreshCurrentFeed() {
    this.props.currentUserFeedFetch();
  }

  onEndReached() {
    this.props.currentUserFeedFetchMore();
  }

  renderRow(rowData) {
    return <PostPreview postData={rowData.item} navigation={this.props.navigation} />;
  }

  renderLoader() {
    const { loadingFetchMoreCurrentUserFeed } = this.props;

    if (loadingFetchMoreCurrentUserFeed) {
      return (
        <LoadingContainer>
          <LargeLoading />
        </LoadingContainer>
      );
    }

    return null;
  }

  renderEmptyComponent() {
    const { currentUserFeed, loadingFetchCurrentUserFeed } = this.props;

    if (_.isEmpty(currentUserFeed) && !loadingFetchCurrentUserFeed) {
      return (
        <EmptyContainer>
          <EmptyText>{i18n.feed.currentUserFeedEmpty}</EmptyText>
        </EmptyContainer>
      );
    }

    return null;
  }

  render() {
    const { currentUserFeed, loadingFetchCurrentUserFeed, hideFeed } = this.props;
    return (
      <Container style={hideFeed && { height: 0, width: 0, display: 'none' }}>
        <StyledFlatList
          data={currentUserFeed}
          renderItem={this.renderRow}
          enableEmptySections
          initialNumToRender={4}
          onEndReached={this.onEndReached}
          keyExtractor={(item, index) => `${_.get(item, 'id', '')}${index}`}
          ListEmptyComponent={this.renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchCurrentUserFeed}
              onRefresh={this.onRefreshCurrentFeed}
              tintColor={COLORS.PRIMARY_COLOR}
              colors={[COLORS.PRIMARY_COLOR]}
            />
          }
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUserFeed);
