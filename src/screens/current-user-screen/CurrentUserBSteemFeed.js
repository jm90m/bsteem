import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import { COLORS } from 'constants/styles';
import { connect } from 'react-redux';
import {
  getCurrentUserBSteemFeed,
  getLoadingFetchCurrentUserBSteemFeed,
  getLoadingFetchMoreCurrentBSteemUserFeed,
} from 'state/rootReducer';
import {
  currentUserBSteemFeedFetch,
  currentUserBSteemFeedFetchMore,
} from 'state/actions/currentUserActions';
import PostPreview from 'components/post-preview/PostPreview';
import { TRENDING } from 'constants/feedFilters';
import i18n from '../../i18n/i18n';

const Container = styled.View`
  flex: 1;
`;

const StyledFlatList = styled.FlatList`
  flex: 1;
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const EmptyContainer = styled.View`
  margin: 5px 0;
  padding: 20px;
  background-color: ${COLORS.WHITE.WHITE};
`;

const EmptyText = styled.Text``;

const mapStateToProps = state => ({
  currentUserBSteemFeed: getCurrentUserBSteemFeed(state),
  loadingFetchCurrentUserBSteemFeed: getLoadingFetchCurrentUserBSteemFeed(state),
  loadingFetchMoreCurrentBSteemUserFeed: getLoadingFetchMoreCurrentBSteemUserFeed(state),
});

const mapDispatchToProps = dispatch => ({
  currentUserBSteemFeedFetch: filter => dispatch(currentUserBSteemFeedFetch.action({ filter })),
  currentUserBSteemFeedFetchMore: filter =>
    dispatch(currentUserBSteemFeedFetchMore.action({ filter })),
});

class CurrentUserBSteemFeed extends Component {
  static propTypes = {
    currentUserBSteemFeed: PropTypes.arrayOf(PropTypes.shape()),
    loadingFetchCurrentUserBSteemFeed: PropTypes.bool.isRequired,
    loadingFetchMoreCurrentBSteemUserFeed: PropTypes.bool.isRequired,
    currentUserBSteemFeedFetch: PropTypes.func.isRequired,
    currentUserBSteemFeedFetchMore: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    hideFeed: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    currentUserBSteemFeed: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      currentFilter: TRENDING.id,
    };

    this.onRefreshCurrentFeed = this.onRefreshCurrentFeed.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
  }

  componentDidMount() {
    if (_.isEmpty(this.props.currentUserBSteemFeed)) {
      this.props.currentUserBSteemFeedFetch(this.state.currentFilter);
    }
  }

  onRefreshCurrentFeed() {
    this.props.currentUserBSteemFeedFetch(this.state.currentFilter);
  }

  onEndReached() {
    this.props.currentUserBSteemFeedFetchMore(this.state.currentFilter);
  }

  renderRow(rowData) {
    return <PostPreview postData={rowData.item} navigation={this.props.navigation} />;
  }

  renderEmptyComponent() {
    const { currentUserBSteemFeed, loadingFetchMoreCurrentBSteemUserFeed } = this.props;

    if (_.isEmpty(currentUserBSteemFeed) && !loadingFetchMoreCurrentBSteemUserFeed) {
      return (
        <EmptyContainer>
          <EmptyText>{i18n.feed.currentUserBSteemFeedEmpty}</EmptyText>
        </EmptyContainer>
      );
    }

    return null;
  }

  render() {
    const { currentUserBSteemFeed, loadingFetchCurrentUserBSteemFeed, hideFeed } = this.props;
    const containerStyles = hideFeed ? { width: 0, height: 0 } : {};
    return (
      <Container style={containerStyles}>
        <StyledFlatList
          data={currentUserBSteemFeed}
          renderItem={this.renderRow}
          enableEmptySections
          keyExtractor={(item, index) => `${_.get(item, 'id', '')}${index}`}
          ListEmptyComponent={this.renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchCurrentUserBSteemFeed}
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

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUserBSteemFeed);
