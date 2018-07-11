import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { getFilterFeedByFollowers } from 'state/rootReducer';
import {
  fetchDiscussions,
  enableFilterHomeFeedByFollowers,
  disableFilterHomeFeedByFollowers,
} from 'state/actions/homeActions';
import { TRENDING } from 'constants/feedFilters';
import * as navigationConstants from 'constants/navigation';
import commonStyles from 'styles/common';
import { displayPriceModal } from 'state/actions/appActions';
import HomeScreenNavigationHeader from 'components/home-screen/HomeScreenNavigationHeader';
import HomeScreenFeed from 'components/home-screen/HomeScreenFeed';

let FeedSort = null;
let BSteemModal = null;

const mapStateToProps = state => ({
  filterFeedByFollowers: getFilterFeedByFollowers(state),
});

const mapDispatchToProps = dispatch => ({
  fetchDiscussions: filter => dispatch(fetchDiscussions(filter)),
  displayPriceModal: symbols => dispatch(displayPriceModal(symbols)),
  enableFilterHomeFeedByFollowers: () => dispatch(enableFilterHomeFeedByFollowers()),
  disableFilterHomeFeedByFollowers: () => dispatch(disableFilterHomeFeedByFollowers()),
});

class HomeScreen extends Component {
  static propTypes = {
    filterFeedByFollowers: PropTypes.bool.isRequired,
    fetchDiscussions: PropTypes.func.isRequired,
    displayPriceModal: PropTypes.func.isRequired,
    enableFilterHomeFeedByFollowers: PropTypes.func.isRequired,
    disableFilterHomeFeedByFollowers: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false,
      currentFilter: TRENDING,
    };

    this.handleSortPost = this.handleSortPost.bind(this);
    this.handleDisplayMenu = this.handleDisplayMenu.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.handleNavigateToSavedTags = this.handleNavigateToSavedTags.bind(this);
    this.handleFilterFeedByFollowers = this.handleFilterFeedByFollowers.bind(this);
    this.handleDisplayPriceModal = this.handleDisplayPriceModal.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { menuVisible, currentFilter } = this.state;
    const diffMenuVisible = menuVisible !== nextState.menuVisible;
    const diffCurrentFilter = currentFilter !== nextState.currentFilter;

    return diffMenuVisible || diffCurrentFilter;
  }

  handleHideMenu() {
    this.setState({
      menuVisible: false,
    });
  }

  handleDisplayMenu() {
    if (BSteemModal === null) {
      BSteemModal = require('components/common/BSteemModal').default;
    }

    if (FeedSort === null) {
      FeedSort = require('components/feed-sort/FeedSort').default;
    }

    this.setState({
      menuVisible: true,
    });
  }

  handleSortPost(filter) {
    this.setState(
      {
        currentFilter: filter,
        menuVisible: false,
      },
      () => this.props.fetchDiscussions(filter),
    );
  }

  handleFilterFeedByFollowers() {
    const { filterFeedByFollowers } = this.props;

    if (filterFeedByFollowers) {
      this.props.disableFilterHomeFeedByFollowers();
    } else {
      this.props.enableFilterHomeFeedByFollowers();
    }
  }

  handleDisplayPriceModal() {
    this.props.displayPriceModal(['STEEM', 'SBD*']);
  }

  handleNavigateToSavedTags() {
    this.props.navigation.navigate(navigationConstants.SAVED_CONTENT);
  }

  render() {
    const { filterFeedByFollowers } = this.props;
    const { menuVisible, currentFilter } = this.state;

    return (
      <View style={commonStyles.container}>
        <HomeScreenNavigationHeader
          handleDisplayPriceModal={this.handleDisplayPriceModal}
          handleNavigateToSavedTags={this.handleNavigateToSavedTags}
          handleDisplayMenu={this.handleDisplayMenu}
          currentFilter={currentFilter}
        />
        {menuVisible && (
          <BSteemModal visible={menuVisible} handleOnClose={this.handleHideMenu}>
            <FeedSort
              hideMenu={this.handleHideMenu}
              handleSortPost={this.handleSortPost}
              handleFilterFeedByFollowers={this.handleFilterFeedByFollowers}
              filterFeedByFollowers={filterFeedByFollowers}
            />
          </BSteemModal>
        )}
        <HomeScreenFeed currentFilter={currentFilter} />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
