import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, RefreshControl } from 'react-native';
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
import LargeLoadingCenter from 'components/common/LargeLoadingCenter';

const Container = styled.View`
  flex: 1;
`;

const StyledListView = styled.ListView`
  flex: 1;
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
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

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

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
    return <PostPreview postData={rowData} navigation={this.props.navigation} />;
  }

  render() {
    const {
      loadingFetchCurrentUserFeed,
      currentUserFeed,
      loadingFetchMoreCurrentUserFeed,
    } = this.props;
    const dataSource = ds.cloneWithRows(currentUserFeed);
    return (
      <Container>
        <StyledListView
          dataSource={dataSource}
          renderRow={this.renderRow}
          enableEmptySections
          onEndReached={this.onEndReached}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchCurrentUserFeed}
              onRefresh={this.onRefreshCurrentFeed}
              colors={[COLORS.PRIMARY_COLOR]}
            />
          }
        />
        {loadingFetchMoreCurrentUserFeed && <LargeLoadingCenter />}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUserFeed);
