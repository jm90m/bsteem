import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { RefreshControl, View } from 'react-native';
import styled from 'styled-components/native';
import PostPreview from 'components/post-preview/PostPreview';
import UserHeader from 'components/user/user-header/UserHeader';
import LargeLoading from 'components/common/LargeLoading';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledFlatList from 'components/common/StyledFlatList';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import CompactViewFeedHeaderSetting from 'components/common/CompactViewFeedHeaderSetting';
import { connect } from 'react-redux';
import { getCustomTheme, getIntl } from 'state/rootReducer';

const LoadingContainer = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const EmptyContainer = styled(StyledViewPrimaryBackground)`
  margin: 5px 0;
  padding: 20px;
`;

const EmptyText = styled(StyledTextByBackground)``;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

class UserBlog extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  static propTypes = {
    fetchMoreUserPosts: PropTypes.func.isRequired,
    isCurrentUser: PropTypes.bool,
    customTheme: PropTypes.shape().isRequired,
    navigation: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
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
    const { loadingUserBlog, intl } = this.props;

    if (loadingUserBlog) {
      return (
        <LoadingContainer>
          <LargeLoading />
        </LoadingContainer>
      );
    }

    return (
      <EmptyContainer>
        <EmptyText>{intl.empty_user_profile}</EmptyText>
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
      customTheme,
    } = this.props;

    return (
      <StyledFlatList
        data={userBlog}
        renderItem={this.renderUserPostRow}
        enableEmptySections
        onEndReached={fetchMoreUserPosts}
        ListHeaderComponent={
          <View>
            <UserHeader
              username={username}
              navigation={navigation}
              hideFollowButton={isCurrentUser}
            />
            <CompactViewFeedHeaderSetting />
          </View>
        }
        keyExtractor={(item, index) => `${_.get(item, 'item.id', '')}${index}`}
        ListEmptyComponent={this.renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshUserBlogLoading}
            onRefresh={refreshUserBlog}
            tintColor={customTheme.primaryColor}
            colors={[customTheme.primaryColor]}
          />
        }
      />
    );
  }
}

export default connect(mapStateToProps)(UserBlog);
