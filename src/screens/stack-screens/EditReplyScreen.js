import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import i18n from 'i18n/i18n';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import { FormInput } from 'react-native-elements';
import PrimaryButton from 'components/common/PrimaryButton';
import * as editorActions from '../../state/actions/editorActions';

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Container = styled.View``;

const ReplyContentContainer = styled.ScrollView``;

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
`;

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

class EditReplyScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          parentPost: PropTypes.shape().isRequired,
          originalComment: PropTypes.shape().isRequired,
          successEditReply: PropTypes.func.isRequired,
        }),
      }),
    }).isRequired,
    createComment: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { originalComment } = props.navigation.state.params;
    const body = _.get(originalComment, 'body', '');
    this.state = {
      replyText: body,
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
    const { successEditReply } = this.props.navigation.state.params;
    this.setReplyLoading(false);
    successEditReply(newComment);
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
    const { parentPost, originalComment } = this.props.navigation.state.params;
    const isUpdating = true;
    this.setReplyLoading(true);

    this.props.createComment(
      parentPost,
      replyText,
      isUpdating,
      originalComment,
      this.onSuccessReply,
      this.onFailReply,
    );
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { replyText, replyLoading } = this.state;
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
            <Title>{i18n.titles.editComment}</Title>
          </TitleContainer>
          <HeaderEmptyView />
        </Header>
        <ReplyContentContainer>
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
        </ReplyContentContainer>
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(EditReplyScreen);
