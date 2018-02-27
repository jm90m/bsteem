import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import * as navigationConstants from 'constants/navigation';
import { COLORS } from 'constants/styles';
import Header from '../../post-preview/Header';
import CommentFooter from './CommentsFooter';
import BodyShort from '../../post-preview/BodyShort';

const Container = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 5px;
  margin-bottom: 5px;
  border-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-width: 2px;
`;

const Title = styled.Text`
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 20px;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
`;

const TitleContainer = styled.View`
  flex-direction: row;
`;

const CommentTag = styled.View`
  background-color: ${COLORS.GREY.GONDOLA};
  padding: 3px;
  width: 30px;
  height: 20px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-top: 3px;
  margin-right: 5px;
`;

const CommentTagText = styled.Text`
  color: ${COLORS.WHITE.WHITE};
  line-height: 20px;
  font-size: 12px;
  justify-content: center;
  border-radius: 4px;
`;

const Touchable = styled.TouchableOpacity``;

class CommentsPreview extends Component {
  static propTypes = {
    commentData: PropTypes.shape(),
    navigation: PropTypes.shape().isRequired,
    currentUsername: PropTypes.string,
  };

  static defaultProps = {
    commentData: {},
    currentUsername: '',
  };

  constructor(props) {
    super(props);

    this.navigateToFullComment = this.navigateToFullComment.bind(this);
    this.navigateToParent = this.navigateToParent.bind(this);
  }

  navigateToParent() {
    const { commentData } = this.props;
    const { parent_author, parent_permlink } = commentData;

    this.props.navigation.navigate(navigationConstants.FETCH_POST, {
      author: parent_author,
      permlink: parent_permlink,
    });
  }

  navigateToFullComment() {
    const { commentData } = this.props;
    const { author, permlink } = commentData;
    this.props.navigation.navigate(navigationConstants.FETCH_POST, {
      author,
      permlink,
    });
  }

  render() {
    const { commentData, navigation, currentUsername } = this.props;

    return (
      <Container>
        <Header postData={commentData} navigation={navigation} currentUsername={currentUsername} />
        <Touchable onPress={this.navigateToParent}>
          <TitleContainer>
            <CommentTag>
              <CommentTagText>{'RE'}</CommentTagText>
            </CommentTag>
            <Title>{commentData.root_title}</Title>
          </TitleContainer>
        </Touchable>
        <Touchable onPress={this.navigateToFullComment}>
          <BodyShort content={commentData.body} />
        </Touchable>
        <CommentFooter commentData={commentData} />
      </Container>
    );
  }
}

export default CommentsPreview;
