import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import PostPreview from 'components/post-preview/PostPreview';
import UserHeader from 'components/user/user-header/UserHeader';
import LargeLoading from 'components/common/LargeLoading';
import i18n from 'i18n/i18n';

const StyledFlatList = styled.FlatList`
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

class UserBlog extends Component {
  static propTypes = {
    fetchMoreUserPosts: PropTypes.func.isRequired,
    isCurrentUser: PropTypes.bool,
    navigation: PropTypes.shape().isRequired,
    userBlog: PropTypes.arrayOf(PropTypes.shape()),
    username: PropTypes.string,
    loadingUserBlog: PropTypes.bool.isRequired,
    refreshUserBlogLoading: PropTypes.bool,
    refreshUserBlog: PropTypes.func,
  };

  static defaultProps = {
    isCurrentUser: false,
    refreshUserBlogLoading: false,
    username: '',
    userBlog: [],
    refreshUserBlog: () => {},
  };

  constructor(props) {
    super(props);
    this.renderUserPostRow = this.renderUserPostRow.bind(this);
    this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
  }

  renderEmptyComponent() {
    const { loadingUserBlog } = this.props;

    if (loadingUserBlog) {
      return (
        <LoadingContainer>
          <LargeLoading />
        </LoadingContainer>
      );
    }

    return (
      <EmptyContainer>
        <EmptyText>{i18n.feed.userFeedEmpty}</EmptyText>
      </EmptyContainer>
    );
  }

  renderUserPostRow(rowData) {
    const postData = rowData.item;
    const { username, navigation } = this.props;

    return <PostPreview postData={postData} navigation={navigation} currentUsername={username} />;
  }

  render() {
    const {
      userBlog,
      fetchMoreUserPosts,
      refreshUserBlog,
      refreshUserBlogLoading,
      username,
      navigation,
      isCurrentUser,
    } = this.props;

    return (
      <StyledFlatList
        data={userBlog}
        renderItem={this.renderUserPostRow}
        enableEmptySections
        onEndReached={fetchMoreUserPosts}
        ListHeaderComponent={
          <UserHeader
            username={username}
            navigation={navigation}
            hideFollowButton={isCurrentUser}
          />
        }
        keyExtractor={(item, index) => `${_.get(item, 'item.id', '')}${index}`}
        ListEmptyComponent={this.renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshUserBlogLoading}
            onRefresh={refreshUserBlog}
            tintColor={COLORS.PRIMARY_COLOR}
            colors={[COLORS.PRIMARY_COLOR]}
          />
        }
      />
    );
  }
}

export default UserBlog;
