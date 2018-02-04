import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchComments } from 'state/actions/postActions';
import CommentsContainer from 'components/post/comments/CommentsContainer';
import { ICON_SIZES, MATERIAL_ICONS, COLORS } from 'constants/styles';
import { getCommentsByPostId, getLoadingComments } from 'state/rootReducer';
import Header from 'components/common/Header';
import LargeLoadingCenter from 'components/common/LargeLoadingCenter';
import HeaderEmptyView from 'components/common/HeaderEmptyView';

const Container = styled.View``;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Title = styled.Text``;

const LoadingContainer = styled.View`
  margin-top: 50px;
`;

const mapStateToProps = state => ({
  commentsByPostId: getCommentsByPostId(state),
  loadingComments: getLoadingComments(state),
});
const mapDispatchToProps = dispatch => ({
  fetchComments: (category, author, permlink, postId) =>
    dispatch(fetchComments(category, author, permlink, postId)),
});

@connect(mapStateToProps, mapDispatchToProps)
class CommentScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape(),
    fetchComments: PropTypes.func.isRequired,
    commentsByPostId: PropTypes.shape(),
    loadingComments: PropTypes.bool,
  };

  static defaultProps = {
    navigation: {},
    commentsByPostId: {},
    loadingComments: false,
  };

  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);

    this.navigateBack = this.navigateBack.bind(this);
  }

  componentDidMount() {
    const { commentsByPostId } = this.props;
    const { author, permlink, postId, category } = this.props.navigation.state.params;
    const postComments = _.get(commentsByPostId, postId, null);
    if (_.isEmpty(postComments) || _.isNull(postComments)) {
      this.props.fetchComments(category, author, permlink, postId);
    }
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { postId, postData } = this.props.navigation.state.params;
    const { loadingComments } = this.props;
    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={ICON_SIZES.menuIcon} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <Title>{'Comments'}</Title>
          <HeaderEmptyView />
        </Header>
        <CommentsContainer postId={postId} postData={postData} />
        {loadingComments && (
          <LoadingContainer>
            <LargeLoadingCenter />
          </LoadingContainer>
        )}
      </Container>
    );
  }
}

export default CommentScreen;
