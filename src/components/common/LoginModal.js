import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Expo, { AuthSession } from 'expo';
import { Modal, AsyncStorage } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MATERIAL_ICONS } from 'constants/styles';
import PrimaryButton from 'components/common/PrimaryButton';
import SecondaryButton from 'components/common/SecondaryButton';
import TitleText from 'components/common/TitleText';
import tinycolor from 'tinycolor2';
import sc2 from 'api/sc2';
import {
  AUTH_EXPIRATION,
  AUTH_MAX_EXPIRATION_AGE,
  AUTH_USERNAME,
  STEEM_ACCESS_TOKEN,
} from '../../constants/asyncStorageKeys';
import { COLORS } from '../../constants/styles';

const Container = styled.View`
  padding-top: 40px;
  align-items: center;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  flex: 1;
`;

const TitleTextContainer = styled(TitleText)`
  padding: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 22px;
`;

const CloseTouchable = styled.TouchableOpacity`
  padding: 30px;
  margin-left: auto;
`;

const ButtonContainer = styled.View`
  margin-top: 20px;
`;

class LoginModal extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    handleLoginModalCancel: PropTypes.func.isRequired,
    authenticateUserSuccess: PropTypes.func.isRequired,
    authenticateUserError: PropTypes.func.isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.handleSteemConnectLogin = this.handleSteemConnectLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  async handleSignUp() {
    this.props.handleLoginModalCancel();
    const signUpURL = 'https://signup.steemit.com/?ref=bsteem';
    try {
      Expo.WebBrowser.openBrowserAsync(signUpURL).catch(error => {
        console.log('invalid url', error, signUpURL);
      });
    } catch (error) {
      console.log('unable to open url', error, signUpURL);
    }
  }

  async handleSteemConnectLogin() {
    this.props.handleLoginModalCancel();
    let redirectUrl = AuthSession.getRedirectUrl();
    const url = sc2.getLoginURL({ authenticated: true });
    try {
      let result = await AuthSession.startAsync({
        authUrl: url,
        returnUrl: `${Expo.Constants.linkingUri}/redirect`,
      });
      if (result.type === 'success') {
        const accessToken = result.params.access_token;
        const expiresIn = result.params.expires_in;
        const username = result.params.username;
        const maxAge = result.params.expires_in * 1000;
        const response = {
          accessToken,
          expiresIn,
          username,
          maxAge,
        };
        sc2.setAccessToken(accessToken);
        AsyncStorage.setItem(STEEM_ACCESS_TOKEN, accessToken);
        AsyncStorage.setItem(AUTH_EXPIRATION, expiresIn);
        AsyncStorage.setItem(AUTH_USERNAME, username);
        AsyncStorage.setItem(AUTH_MAX_EXPIRATION_AGE, `${maxAge}`);
        this.props.authenticateUserSuccess(accessToken, expiresIn, username, maxAge);
      } else {
        this.props.authenticateUserError();
      }
    } catch (error) {
      console.warn('error authenticating user', error);
    }
  }

  render() {
    const { visible, handleLoginModalCancel, customTheme, intl } = this.props;
    const loginButtonTextColor = tinycolor(customTheme.primaryColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;
    const signupButtonTextColor = tinycolor(customTheme.secondaryColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;

    return (
      <Modal animationType="slide" visible={visible} onRequestClose={handleLoginModalCancel}>
        <Container customTheme={customTheme}>
          <CloseTouchable onPress={handleLoginModalCancel}>
            <MaterialIcons
              name={MATERIAL_ICONS.close}
              size={40}
              color={
                tinycolor(customTheme.primaryBackgroundColor).isDark()
                  ? COLORS.LIGHT_TEXT_COLOR
                  : COLORS.DARK_TEXT_COLOR
              }
            />
          </CloseTouchable>
          <TitleTextContainer>{intl.steemconnect_login_description}</TitleTextContainer>
          <ButtonContainer>
            <PrimaryButton
              onPress={this.handleSteemConnectLogin}
              title={intl.login_with_steemconnect}
              fontWeight="bold"
              backgroundColor={customTheme.primaryColor}
              color={loginButtonTextColor}
            />
          </ButtonContainer>
          <ButtonContainer>
            <SecondaryButton
              onPress={this.handleSignUp}
              fontWeight="bold"
              title={intl.signup}
              color={signupButtonTextColor}
            />
          </ButtonContainer>
        </Container>
      </Modal>
    );
  }
}

export default LoginModal;
