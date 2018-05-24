import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import Avatar from 'components/common/Avatar';
import TimeAgo from 'components/common/TimeAgo';
import { connect } from 'react-redux';
import tinycolor from 'tinycolor2';
import { getCustomTheme } from 'state/rootReducer';

const Container = styled.View`
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  margin-top: 5px;
  margin-bottom: 5px;
  border-color: ${props => props.customTheme.primaryBorderColor};
  border-top-width: 1px;
  border-bottom-width: 1px;
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
  color: ${props => props.customTheme.primaryColor};
`;

const PostTitle = styled.Text`
  padding-left: 5px;
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 20px;
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const ActionComponent = styled.View`
  margin-left: auto;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

class PostPreview extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    author: PropTypes.string,
    title: PropTypes.string,
    created: PropTypes.string,
    handleNavigatePost: PropTypes.func,
    handleNavigateUser: PropTypes.func,
    actionComponent: PropTypes.element,
  };

  static defaultProps = {
    author: '',
    title: '',
    created: '',
    handleNavigatePost: () => {},
    handleNavigateUser: () => {},
    actionComponent: null,
  };

  render() {
    const {
      author,
      title,
      created,
      handleNavigatePost,
      handleNavigateUser,
      actionComponent,
      customTheme,
    } = this.props;

    return (
      <Container customTheme={customTheme}>
        <AuthorContainer>
          <TouchableOpacity onPress={handleNavigateUser}>
            <Avatar username={author} size={40} />
          </TouchableOpacity>
          <AuthorContents>
            <TouchableOpacity onPress={handleNavigateUser}>
              <AuthorText customTheme={customTheme}>{author}</AuthorText>
            </TouchableOpacity>
            <TimeAgo created={created} />
          </AuthorContents>
          <ActionComponent>{actionComponent}</ActionComponent>
        </AuthorContainer>
        <TouchableOpacity onPress={handleNavigatePost}>
          <PostTitle customTheme={customTheme}>{title}</PostTitle>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(PostPreview);
