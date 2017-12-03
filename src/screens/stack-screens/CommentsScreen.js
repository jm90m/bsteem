import React, { Component } from 'react';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { fetchComments } from '../../state/actions/postActions';

const Container = styled.View``;

const Header = styled.View`
  flex-direction: row;
  height: 30px;
`;

const Touchable = styled.TouchableOpacity``;

const mapDispatchToProps = dispatch => ({
  fetchComments: (category, author, permlink, postId) =>
    dispatch(fetchComments(category, author, permlink, postId)),
});

@connect(null, mapDispatchToProps)
class CommentScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
  };

  componentDidMount() {
    const { author, permlink, postId, category } = this.props.navigation.state.params;
    this.props.fetchComments(category, author, permlink, postId);
  }

  navigateBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <Container>
        <Header>
          <Touchable onPress={this.navigateBack}>
            <FontAwesome size={20} name={'chevron-left'} />
          </Touchable>
        </Header>
      </Container>
    );
  }
}

export default CommentScreen;
