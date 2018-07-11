import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import _ from 'lodash';
import { MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import { abbreviateLargeNumber } from 'util/numberFormatter';
import { SEARCH_MENU } from 'constants/navigation';
import SearchMenuButton from './SearchMenuButton';
import {
  getSearchPostsResults,
  getSearchTagsResults,
  getSearchUsersResults,
} from '../../state/rootReducer';

const styles = StyleSheet.create({
  menuContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
});

const SearchMenu = ({
  selectedUsers,
  selectedTags,
  selectedPosts,
  handleSetCurrentMenu,
  searchTagsResults,
  searchUserResults,
  searchPostResults,
}) => {
  const tagsCount = abbreviateLargeNumber(_.size(searchTagsResults));
  const usersCount = abbreviateLargeNumber(_.size(searchUserResults));
  const postsCount = abbreviateLargeNumber(_.size(searchPostResults));

  return (
    <View style={styles.menuContainer}>
      <SearchMenuButton
        handleSetCurrentMenu={handleSetCurrentMenu(SEARCH_MENU.TAGS)}
        isSelected={selectedTags}
        count={tagsCount}
        iconName={MATERIAL_COMMUNITY_ICONS.tag}
      />
      <SearchMenuButton
        handleSetCurrentMenu={handleSetCurrentMenu(SEARCH_MENU.USERS)}
        isSelected={selectedUsers}
        count={usersCount}
        iconName={MATERIAL_COMMUNITY_ICONS.account}
      />
      <SearchMenuButton
        handleSetCurrentMenu={handleSetCurrentMenu(SEARCH_MENU.POSTS)}
        isSelected={selectedPosts}
        count={postsCount}
        iconName={MATERIAL_COMMUNITY_ICONS.posts}
      />
    </View>
  );
};

SearchMenu.propTypes = {
  searchUserResults: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  searchPostResults: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  searchTagsResults: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedUsers: PropTypes.bool,
  selectedTags: PropTypes.bool,
  selectedPosts: PropTypes.bool,
  handleSetCurrentMenu: PropTypes.func,
};

SearchMenu.defaultProps = {
  handleSetCurrentMenu: () => {},
  selectedUsers: false,
  selectedTags: false,
  selectedPosts: false,
};

const mapStateToProps = state => ({
  searchUserResults: getSearchUsersResults(state),
  searchPostResults: getSearchPostsResults(state),
  searchTagsResults: getSearchTagsResults(state),
});

export default connect(mapStateToProps)(SearchMenu);
