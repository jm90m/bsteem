import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Expo, { AuthSession } from 'expo';
import { Modal, AsyncStorage } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import i18n from 'i18n/i18n';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import PrimaryButton from 'components/common/PrimaryButton';
import SecondaryButton from 'components/common/SecondaryButton';
import sc2 from 'api/sc2';
import {
  AUTH_EXPIRATION,
  AUTH_MAX_EXPIRATION_AGE,
  AUTH_USERNAME,
  STEEM_ACCESS_TOKEN,
} from '../../constants/asyncStorageKeys';
import BsteemIcon from '../../../assets/bsteem-name-logo.png';

const Container = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.SPLASH_SCREEN_BACKGROUND};
`;

const TitleText = styled.Text`
  padding: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 22px;
`;

const Logo = styled.Image``;

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
  };

  constructor(props) {
    super(props);

    this.handleSteemConnectLogin = this.handleSteemConnectLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  async handleSignUp() {
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
    const { visible, handleLoginModalCancel } = this.props;

    return (
      <Modal animationType="slide" visible={visible} onRequestClose={handleLoginModalCancel}>
        <Container>
          <CloseTouchable onPress={handleLoginModalCancel}>
            <MaterialIcons name={MATERIAL_ICONS.close} size={40} />
          </CloseTouchable>
          <Logo source={BsteemIcon} style={{ width: 200, height: 200 }} resizeMode="contain" />
          <TitleText>{i18n.login.description}</TitleText>
          <ButtonContainer>
            <PrimaryButton
              onPress={this.handleSteemConnectLogin}
              title={i18n.login.loginWithSC}
              fontWeight="bold"
              backgroundColor={COLORS.PRIMARY_COLOR}
            />
          </ButtonContainer>
          <ButtonContainer>
            <SecondaryButton
              onPress={this.handleSignUp}
              fontWeight="bold"
              title={i18n.login.signUp}
            />
          </ButtonContainer>
        </Container>
      </Modal>
    );
  }
}

export default LoginModal;
