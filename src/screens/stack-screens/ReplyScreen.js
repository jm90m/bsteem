import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { Dimensions, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import i18n from 'i18n/i18n';
import { getReputation } from 'util/steemitFormatters';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import { FormInput } from 'react-native-elements';
import CommentContent from 'components/post/comments/CommentContent';
import Avatar from 'components/common/Avatar';
import PrimaryButton from 'components/common/PrimaryButton';
import * as editorActions from '../../state/actions/editorActions';

const { width: deviceWidth } = Dimensions.get('screen');

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Container = styled.View`
  flex: 1;
`;

const ReplyContentContainer = styled.ScrollView``;

const AvatarContainer = styled.View`
  padding: 5px 10px;
`;

const CommentContainer = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
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
    };
    this.navigateBack = this.navigateBack.bind(this);
    this.onChangeReplyText = this.onChangeReplyText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSuccessReply = this.onSuccessReply.bind(this);
    this.onFailReply = this.onFailReply.bind(this);
    this.setReplyLoading = this.setReplyLoading.bind(this);
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
    const { replyText, replyLoading } = this.state;
    const commentAuthorReputation = getReputation(parentPost.author_reputation);
    const contentWidth = deviceWidth - 30;
    const avatarSize = 40;
    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={ICON_SIZES.menuIcon} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <TitleContainer>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_ICONS.reply}
              color={COLORS.PRIMARY_COLOR}
            />
            <Title>{`${i18n.titles.replyTo} ${parentPost.author}`}</Title>
          </TitleContainer>
          <HeaderEmptyView />
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
          </ReplyContentContainer>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplyScreen);
