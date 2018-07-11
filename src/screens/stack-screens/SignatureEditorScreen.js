import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImagePicker } from 'expo';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import {
  Dimensions,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import styled from 'styled-components/native';
import Header from 'components/common/Header';
import _ from 'lodash';
import BackButton from 'components/common/BackButton';
import HTML from 'react-native-render-html';
import { updateUserSignature } from 'state/actions/settingsActions';
import { uploadImage } from 'state/actions/editorActions';
import tinycolor from 'tinycolor2';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES, COLORS, MATERIAL_ICONS } from 'constants/styles';
import { FormLabel, FormInput, Icon } from 'react-native-elements';
import { getHtml } from 'util/postUtils';
import {
  getCustomTheme,
  getIntl,
  getSignature,
  getLoadingSavingSignature,
} from 'state/rootReducer';
import TitleText from 'components/common/TitleText';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import PrimaryButton from 'components/common/PrimaryButton';
import SmallLoading from 'components/common/SmallLoading';
import PrimaryText from 'components/common/text/PrimaryText';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
`;

const RightMenuIconContainer = styled.View`
  padding: 5px;
  flex-direction: row;
`;

const StyledScrollView = styled.ScrollView``;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 20px;
  justify-content: space-between;
  padding-bottom: 100px;
`;

const ActionButtons = styled.View`
  flex-direction: row;
`;

const ActionButtonTouchable = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  justify-content: center;
  background-color: ${props => props.customTheme.secondaryColor};
  border-radius: 25px;
  align-items: center;
  margin-right: 20px;
`;

const PreviewContainer = styled.View`
  padding: 20px;
`;

const StatusContent = styled.View`
  padding: 10px;
  margin-top: 10px;
  flex-direction: row;
  background: ${props => props.customTheme.primaryBackgroundColor};
`;

const StatusText = styled(PrimaryText)`
  margin-left: 5px;
  color: ${props => props.customTheme.secondaryColor};
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
  signature: getSignature(state),
  loadingSavingSignature: getLoadingSavingSignature(state),
});

const mapDispatchToProps = dispatch => ({
  uploadImage: (imageData, callback, errorCallback) =>
    dispatch(uploadImage.action({ imageData, callback, errorCallback })),
  updateUserSignature: (signature, successCallback) =>
    dispatch(updateUserSignature.action({ signature, successCallback })),
});

class SignatureEditorScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    loadingSavingSignature: PropTypes.bool.isRequired,
    signature: PropTypes.string.isRequired,
    uploadImage: PropTypes.func.isRequired,
    updateUserSignature: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      imageLoading: false,
      signatureText: props.signature,
      keyboardDisplayed: false,
      savedSuccess: false,
    };

    this.navigateBack = this.navigateBack.bind(this);
    this.onChangeSignature = this.onChangeSignature.bind(this);
    this.handleSuccessImageUpload = this.handleSuccessImageUpload.bind(this);
    this.handleErrorImageUpload = this.handleErrorImageUpload.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignatureSaveSuccess = this.handleSignatureSaveSuccess.bind(this);
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

  onChangeSignature(signatureText) {
    this.setState({
      signatureText,
    });
  }

  async pickImage() {
    const allowsEditing = Platform.OS !== 'ios';

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing,
    });

    if (!result.cancelled) {
      this.setState({ imageLoading: true });
      this.props.uploadImage(result, this.handleSuccessImageUpload, this.handleErrorImageUpload);
    }
  }

  handleSetKeyboardDisplay = keyboardDisplayed => () => this.setState({ keyboardDisplayed });

  handleSuccessImageUpload(url) {
    this.setState({
      signatureText: `${this.state.signatureText} ${url}`,
      imageLoading: false,
    });
  }

  handleErrorImageUpload() {
    this.setState({
      imageLoading: false,
    });
  }

  handleSignatureSaveSuccess() {
    this.setState({
      savedSuccess: true,
    });
  }

  handleSubmit() {
    const { signatureText } = this.state;
    this.setState({
      savedSuccess: false,
    });
    this.props.updateUserSignature(signatureText, this.handleSignatureSaveSuccess);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { customTheme, intl, loadingSavingSignature } = this.props;
    const { imageLoading, signatureText, keyboardDisplayed, savedSuccess } = this.state;
    const parsedHtmlBody = getHtml(signatureText, {});
    const displayHtmlBody = _.isEmpty(parsedHtmlBody) ? '<div></div>' : parsedHtmlBody;
    const widthOffset = 40;
    const inputTextColor = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.approval}
              color={customTheme.primaryColor}
            />
            <TitleText style={{ marginLeft: 3 }}>{intl.edit_signature}</TitleText>
          </TitleContainer>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <RightMenuIconContainer>
              <MaterialIcons
                size={ICON_SIZES.menuIcon}
                color={keyboardDisplayed ? customTheme.primaryColor : 'transparent'}
                name={MATERIAL_ICONS.keyboardHide}
              />
            </RightMenuIconContainer>
          </TouchableWithoutFeedback>
        </Header>
        <StyledScrollView>
          <KeyboardAvoidingView behavior="padding">
            <FormLabel>{intl.signature}</FormLabel>
            <FormInput
              multiline
              value={signatureText}
              inputStyle={{ width: '100%', color: inputTextColor }}
              onChangeText={this.onChangeSignature}
            />
            <FormLabel>{intl.signature_preview}</FormLabel>
            <PreviewContainer>
              <HTML
                html={displayHtmlBody}
                imagesMaxWidth={deviceWidth - widthOffset}
                onLinkPress={this.handlePostLinkPress}
                staticContentMaxWidth={deviceWidth - widthOffset}
                baseFontStyle={{
                  color: tinycolor(customTheme.primaryBackgroundColor).isDark()
                    ? COLORS.LIGHT_TEXT_COLOR
                    : COLORS.DARK_TEXT_COLOR,
                }}
              />
              {imageLoading && <SmallLoading style={{ marginTop: 20, alignSelf: 'center' }} />}
            </PreviewContainer>
            {savedSuccess && (
              <StatusContent customTheme={customTheme}>
                <MaterialIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={customTheme.positiveColor}
                  name={MATERIAL_ICONS.checkCircle}
                />
                <StatusText style={{ color: customTheme.positiveColor }} customTheme={customTheme}>
                  {intl.signature_saved}
                </StatusText>
              </StatusContent>
            )}
            <ActionButtonsContainer>
              <PrimaryButton
                onPress={this.handleSubmit}
                title={intl.save}
                disabled={loadingSavingSignature}
                loading={loadingSavingSignature}
              />
              <ActionButtons>
                <ActionButtonTouchable
                  customTheme={customTheme}
                  onPress={this.pickImage}
                  disabled={loadingSavingSignature || imageLoading}
                >
                  <Icon
                    name="add-a-photo"
                    backgroundColor={customTheme.secondaryColor}
                    size={ICON_SIZES.actionIcon}
                    color={
                      tinycolor(customTheme.secondaryColor).isDark()
                        ? COLORS.LIGHT_TEXT_COLOR
                        : COLORS.DARK_TEXT_COLOR
                    }
                  />
                </ActionButtonTouchable>
              </ActionButtons>
            </ActionButtonsContainer>
          </KeyboardAvoidingView>
        </StyledScrollView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignatureEditorScreen);
