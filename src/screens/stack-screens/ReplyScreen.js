import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { Dimensions, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import i18n from 'i18n/i18n';
import { getReputation } from 'util/steemitFormatters';
import Header from 'components/common/Header';
import { FormInput } from 'react-native-elements';
import CommentContent from 'components/post/comments/CommentContent';
import Avatar from 'components/common/Avatar';
import PrimaryButton from 'components/common/PrimaryButton';
import BackButton from 'components/common/BackButton';
import * as editorActions from '../../state/actions/editorActions';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View`
  flex: 1;
  background: ${COLORS.PRIMARY_BACKGROUND_COLOR};
`;

const ReplyContentContainer = styled.ScrollView``;

const AvatarContainer = styled.View`
  padding: 5px 10px;
`;

const CommentContainer = styled.View`
  background-color: ${COLORS.PRIMARY_BACKGROUND_COLOR};
  margin-top: 2px;
  margin-bottom: 2px;
`;

const CommentContentContainer = styled.View`
  margin-top: 10px;
  flex-direction: row;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  margin-left: 3px;
`;

const ReplyInputContainer = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  padding: 10px;
`;

const ReplyButtonContainer = styled.View`
  padding-top: 20px;
  padding-bottom: 200px;
`;

const EmptyView = styled.View`
  height: 300px;
  width: 100px;
`;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  createComment: (
    parentPost,
    commentBody,
    isUpdating,
    originalComment,
    successCallback,
    failCallback,
  ) =>
    dispatch(
      editorActions.createComment.action({
        parentPost,
        commentBody,
        isUpdating,
        originalComment,
        successCallback,
        failCallback,
      }),
    ),
});

class ReplyScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          comment: PropTypes.shape(),
          parentPost: PropTypes.shape().isRequired,
          successCreateReply: PropTypes.func,
        }),
      }),
    }).isRequired,
    createComment: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      replyText: '',
      replyLoading: false,
      keyboardDisplayed: false,
    };
    this.navigateBack = this.navigateBack.bind(this);
    this.onChangeReplyText = this.onChangeReplyText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSuccessReply = this.onSuccessReply.bind(this);
    this.onFailReply = this.onFailReply.bind(this);
    this.setReplyLoading = this.setReplyLoading.bind(this);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.handleSetKeyboardDisplay(true),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.handleSetKeyboardDisplay(false),
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onChangeReplyText(replyText) {
    this.setState({
      replyText,
    });
  }

  onSuccessReply(newComment) {
    const { successCreateReply } = this.props.navigation.state.params;
    this.setReplyLoading(false);
    successCreateReply(newComment);
    this.props.navigation.goBack();
  }

  onFailReply() {
    this.setReplyLoading(false);
  }

  setReplyLoading(replyLoading) {
    this.setState({
      replyLoading,
    });
  }

  handleSetKeyboardDisplay = keyboardDisplayed => () => this.setState({ keyboardDisplayed });

  handleSubmit() {
    const { replyText } = this.state;
    const { parentPost } = this.props.navigation.state.params;
    this.setReplyLoading(true);

    this.props.createComment(
      parentPost,
      replyText,
      undefined,
      undefined,
      this.onSuccessReply,
      this.onFailReply,
    );
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { parentPost } = this.props.navigation.state.params;
    const { replyText, replyLoading, keyboardDisplayed } = this.state;
    const commentAuthorReputation = getReputation(parentPost.author_reputation);
    const contentWidth = deviceWidth - 30;
    const avatarSize = 40;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleContainer>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_ICONS.reply}
              color={COLORS.PRIMARY_COLOR}
            />
            <Title>{`${i18n.titles.replyTo} ${parentPost.author}`}</Title>
          </TitleContainer>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <MenuIconContainer>
              <MaterialIcons
                size={ICON_SIZES.menuIcon}
                color={keyboardDisplayed ? COLORS.PRIMARY_COLOR : 'transparent'}
                name={MATERIAL_ICONS.keyboardHide}
              />
            </MenuIconContainer>
          </TouchableWithoutFeedback>
        </Header>
        <KeyboardAvoidingView behavior="padding">
          <ReplyContentContainer>
            <CommentContainer>
              <CommentContentContainer>
                <AvatarContainer>
                  <Avatar size={avatarSize} username={parentPost.author} />
                </AvatarContainer>
                <CommentContent
                  username={parentPost.author}
                  reputation={commentAuthorReputation}
                  created={parentPost.created}
                  body={parentPost.body}
                  commentDepth={parentPost.depth}
                  currentWidth={contentWidth}
                  navigation={this.props.navigation}
                />
              </CommentContentContainer>
            </CommentContainer>
            <ReplyInputContainer>
              <FormInput
                onChangeText={this.onChangeReplyText}
                placeholder={i18n.editor.replyPlaceholder}
                multiline
                value={replyText}
                inputStyle={{ width: '100%' }}
              />
              <ReplyButtonContainer>
                <PrimaryButton
                  onPress={this.handleSubmit}
                  title={i18n.editor.reply}
                  disabled={replyLoading}
                  loading={replyLoading}
                />
              </ReplyButtonContainer>
            </ReplyInputContainer>
            <EmptyView />
          </ReplyContentContainer>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplyScreen);
