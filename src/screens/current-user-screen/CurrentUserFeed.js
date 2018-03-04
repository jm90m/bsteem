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

const Container = styled.View`
  flex: 1;
`;

const StyledFlatList = styled.FlatList`
  flex: 1;
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const LoadingMoreContainer = styled.View`
  align-items: center;
  justify-content: center;
  z-index: 1;
  margin-top: 20px;
`;

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
  };

  static defaultProps = {
    currentUserFeed: [],
  };

  constructor(props) {
    super(props);

    this.onRefreshCurrentFeed = this.onRefreshCurrentFeed.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
  }

  componentDidMount() {
    this.props.currentUserFeedFetch();
  }

  componentWillReceiveProps(nextProps) {
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

  render() {
    const {
      loadingFetchCurrentUserFeed,
      currentUserFeed,
      loadingFetchMoreCurrentUserFeed,
    } = this.props;
    return (
      <Container>
        <StyledFlatList
          data={currentUserFeed}
          renderItem={this.renderRow}
          enableEmptySections
          onEndReached={this.onEndReached}
          keyExtractor={(item, index) => `${_.get(item, 'item.id', '')}${index}`}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchCurrentUserFeed}
              onRefresh={this.onRefreshCurrentFeed}
              colors={[COLORS.PRIMARY_COLOR]}
            />
          }
        />
        {(loadingFetchMoreCurrentUserFeed || loadingFetchCurrentUserFeed) && (
          <LoadingMoreContainer>
            <LargeLoading />
          </LoadingMoreContainer>
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUserFeed);
