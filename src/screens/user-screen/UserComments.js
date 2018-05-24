import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView } from 'react-native';
import _ from 'lodash';
import UserHeader from 'components/user/user-header/UserHeader';
import CommentsPreview from 'components/user/user-comments/CommentsPreview';
import StyledListView from 'components/common/StyledListView';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class UserComments extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  static propTypes = {
    fetchMoreUserComments: PropTypes.func.isRequired,
    isCurrentUser: PropTypes.bool,
    navigation: PropTypes.shape().isRequired,
    userComments: PropTypes.arrayOf(PropTypes.shape()),
    username: PropTypes.string,
  };

  static defaultProps = {
    isCurrentUser: false,
    username: '',
    userComments: [],
  };

  constructor(props) {
    super(props);

    this.renderUserCommentRow = this.renderUserCommentRow.bind(this);
  }

  renderUserCommentRow(rowData) {
    const { username, navigation, isCurrentUser } = this.props;
    if (_.has(rowData, 'renderUserHeader')) {
      return (
        <UserHeader username={username} navigation={navigation} hideFollowButton={isCurrentUser} />
      );
    }
    return (
      <CommentsPreview commentData={rowData} navigation={navigation} currentUsername={username} />
    );
  }

  render() {
    const { userComments, fetchMoreUserComments } = this.props;
    const userHeaderData = [{ renderUserHeader: true }];
    const userCommentsDataSource = _.concat(userHeaderData, userComments);
    return (
      <StyledListView
        dataSource={ds.cloneWithRows(userCommentsDataSource)}
        renderRow={this.renderUserCommentRow}
        enableEmptySections
        onEndReached={fetchMoreUserComments}
      />
    );
  }
}

export default UserComments;
