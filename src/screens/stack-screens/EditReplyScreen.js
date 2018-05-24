import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import Header from 'components/common/Header';
import { FormInput } from 'react-native-elements';
import PrimaryButton from 'components/common/PrimaryButton';
import BackButton from 'components/common/BackButton';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import tinycolor from 'tinycolor2';
import * as editorActions from 'state/actions/editorActions';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import TitleText from 'components/common/TitleText';

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
`;

const ReplyContentContainer = styled.ScrollView``;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled(TitleText)`
  margin-left: 3px;
`;

const ReplyInputContainer = styled.View`
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  padding: 10px;
`;

const ReplyButtonContainer = styled.View`
  padding-top: 20px;
`;

const EmptyView = styled.View`
  height: 300px;
  width: 100px;
`;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

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
    drawerLockMode: 'locked-closed',
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
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
    const { originalComment } = props.navigation.state.params;
    const body = _.get(originalComment, 'body', '');
    this.state = {
      replyText: body,
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

  handleSetKeyboardDisplay = keyboardDisplayed => () => this.setState({ keyboardDisplayed });

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
    const { customTheme, intl } = this.props;
    const { replyText, replyLoading, keyboardDisplayed } = this.state;
    const color = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleContainer>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_ICONS.reply}
              color={customTheme.primaryColor}
            />
            <Title>{intl.edit}</Title>
          </TitleContainer>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <MenuIconContainer>
              <MaterialIcons
                size={ICON_SIZES.menuIcon}
                color={keyboardDisplayed ? customTheme.primaryColor : 'transparent'}
                name={MATERIAL_ICONS.keyboardHide}
              />
            </MenuIconContainer>
          </TouchableWithoutFeedback>
        </Header>
        <KeyboardAvoidingView behavior="padding">
          <ReplyContentContainer>
            <ReplyInputContainer customTheme={customTheme}>
              <FormInput
                onChangeText={this.onChangeReplyText}
                placeholder={intl.reply_placeholder}
                multiline
                value={replyText}
                inputStyle={{ width: '100%', color }}
              />
              <ReplyButtonContainer>
                <PrimaryButton
                  onPress={this.handleSubmit}
                  title={intl.reply}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditReplyScreen);
