import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView } from 'react-native';
import _ from 'lodash';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import PostPreview from 'components/post-preview/PostPreview';
import UserHeader from 'components/user/user-header/UserHeader';

const StyledListView = styled.ListView`
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class UserBlog extends Component {
  static propTypes = {
    fetchMoreUserPosts: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    userBlog: PropTypes.arrayOf(PropTypes.shape()),
    username: PropTypes.string,
  };

  static defaultProps = {
    username: '',
    userBlog: [],
  };

  constructor(props) {
    super(props);
    this.renderUserPostRow = this.renderUserPostRow.bind(this);
  }

  renderUserPostRow(rowData) {
    const { username, navigation } = this.props;
    if (_.has(rowData, 'renderUserHeader')) {
      return <UserHeader username={username} navigation={navigation} />;
    }
    return <PostPreview postData={rowData} navigation={navigation} currentUsername={username} />;
  }

  render() {
    const { userBlog, fetchMoreUserPosts } = this.props;
    const userHeaderData = [{ renderUserHeader: true }];
    const userBlogDataSource = _.concat(userHeaderData, userBlog);
    return (
      <StyledListView
        dataSource={ds.cloneWithRows(userBlogDataSource)}
        renderRow={this.renderUserPostRow}
        enableEmptySections
        onEndReached={fetchMoreUserPosts}
      />
    );
  }
}

export default UserBlog;
