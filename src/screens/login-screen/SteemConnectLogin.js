import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, View, TouchableWithoutFeedback } from 'react-native';
import Expo, { AuthSession } from 'expo';
import { connect } from 'react-redux';
import sc2 from 'api/sc2';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import PrimaryButton from 'components/common/PrimaryButton';
import SecondaryButton from 'components/common/SecondaryButton';
import DEBUG from 'constants/debug';
import {
  STEEM_ACCESS_TOKEN,
  AUTH_EXPIRATION,
  AUTH_MAX_EXPIRATION_AGE,
  AUTH_USERNAME,
} from 'constants/asyncStorageKeys';
import * as authActions from 'state/actions/authActions';
import i18n from 'i18n/i18n';
import BsteemIcon from '../../../assets/bsteem-icon.png';
import { redirectAuthURL } from 'constants/bsteem';

const mapDispatchToProps = dispatch => ({
  authenticateUserSuccess: payload => dispatch(authActions.authenticateUser.success(payload)),
  authenticateUserError: error => dispatch(authActions.authenticateUser.fail(error)),
});

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.SPLASH_SCREEN_BACKGROUND};
  align-items: center;
  justify-content: center;
`;

const DebugText = styled.Text`
  padding: 20px;
`;

const Description = styled.Text`
  padding: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 22px;
`;

const ButtonContainer = styled.View`
  margin-top: 20px;
`;

const Logo = styled.Image``;

class SteemConnectLogin extends Component {
  static propTypes = {
    authenticateUserSuccess: PropTypes.func.isRequired,
    authenticateUserError: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      displayDebug: false,
    };

    this.handleSteemConnectLogin = this.handleSteemConnectLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.displayDebugText = this.displayDebugText.bind(this);
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
        this.props.authenticateUserSuccess(response);
      } else {
        this.props.authenticateUserError();
      }
    } catch (error) {
      console.warn('error authenticating user');
    }
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

  displayDebugText() {
    this.setState({
      displayDebug: true,
    });
  }

  renderDebugText() {
    if (DEBUG || this.state.displayDebug) {
      return (
        <View>
          <DebugText>{`${Expo.Constants.linkingUri}/redirect`}</DebugText>
        </View>
      );
    }
  }

  render() {
    return (
      <Container>
        <TouchableWithoutFeedback onLongPress={this.displayDebugText}>
          <Logo source={BsteemIcon} style={{ width: 200, height: 200 }} resizeMode="contain" />
        </TouchableWithoutFeedback>
        <Description>{i18n.login.description}</Description>
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
        {this.renderDebugText()}
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(SteemConnectLogin);
