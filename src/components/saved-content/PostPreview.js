import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import _ from 'lodash';
import moment from 'moment-timezone';
import Avatar from 'components/common/Avatar';

const Container = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 5px;
  margin-bottom: 5px;
  border-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-width: 2px;
  padding: 10px;
`;

const AuthorContainer = styled.View`
  flex-direction: row;
`;

const AuthorContents = styled.View`
  margin-left: 5px;
`;

const AuthorText = styled.Text`
  font-weight: 700;
  color: ${COLORS.PRIMARY_COLOR};
`;

const PostTitle = styled.Text`
  padding-left: 5px;
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 20px;
`;

const PostCreated = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
`;

class PostPreview extends Component {
  static propTypes = {
    author: PropTypes.string,
    title: PropTypes.string,
    created: PropTypes.string,
    handleNavigatePost: PropTypes.func,
    handleNavigateUser: PropTypes.func,
  };

  static defaultProps = {
    author: '',
    title: '',
    created: '',
    handleNavigatePost: () => {},
    handleNavigateUser: () => {},
  };

  render() {
    const { author, title, created, handleNavigatePost, handleNavigateUser } = this.props;

    return (
      <Container>
        <AuthorContainer>
          <TouchableOpacity onPress={handleNavigateUser}>
            <Avatar username={author} size={40} />
          </TouchableOpacity>
          <AuthorContents>
            <TouchableOpacity onPress={handleNavigateUser}>
              <AuthorText>{`@${author}`}</AuthorText>
            </TouchableOpacity>
            <PostCreated>{moment(created).fromNow(true)}</PostCreated>
          </AuthorContents>
        </AuthorContainer>
        <TouchableOpacity onPress={handleNavigatePost}>
          <PostTitle>{title}</PostTitle>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default PostPreview;
