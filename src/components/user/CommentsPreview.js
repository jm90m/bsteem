import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import Header from '../post-preview/Header';
import CommentFooter from './CommentsFooter';
import BodyShort from '../post-preview/BodyShort';

const Container = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 5px;
  margin-bottom: 5px;
  border-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-width: 2px;
`;

const Content = styled.View`
  padding: 10px;
  padding-left: 0;
  padding-right: 0;
`;

const Title = styled.Text`
  padding: 5px;
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 20px;
`;

class CommentsPreview extends Component {
  static propTypes = {
    commentData: PropTypes.shape(),
    navigation: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    commentData: {},
  };

  render() {
    const { commentData, navigation } = this.props;

    return (
      <Container>
        <Header postData={commentData} navigation={navigation} />
        <Title>{commentData.root_title}</Title>
        <BodyShort content={commentData.body} />
        <CommentFooter commentData={commentData} />
      </Container>
    );
  }
}

export default CommentsPreview;
