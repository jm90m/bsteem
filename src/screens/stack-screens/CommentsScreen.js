import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchComments } from 'state/actions/postActions';
import CommentsContainer from 'components/post/comments/CommentsContainer';
import { ICON_SIZES, MATERIAL_ICONS, COLORS } from 'constants/styles';

const Container = styled.View``;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-color: ${COLORS.WHITE.GAINSBORO};
  border-bottom-width: 1px;
  width: 100%;
  padding-top: 20px;
  min-height: 45px;
`;

const Title = styled.Text``;

const EmptyView = styled.View`
  padding: 10px 20px;
`;

const mapDispatchToProps = dispatch => ({
  fetchComments: (category, author, permlink, postId) =>
    dispatch(fetchComments(category, author, permlink, postId)),
});

@connect(null, mapDispatchToProps)
class CommentScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape(),
    fetchComments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    navigation: {},
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
    const { author, permlink, postId, category } = this.props.navigation.state.params;
    this.props.fetchComments(category, author, permlink, postId);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { postId, postData } = this.props.navigation.state.params;
    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={ICON_SIZES.menuIcon} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <Title>{'Comments'}</Title>
          <EmptyView />
        </Header>
        <CommentsContainer postId={postId} postData={postData} />
      </Container>
    );
  }
}

export default CommentScreen;
