import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, View } from 'react-native';
import Expo, { AuthSession } from 'expo';
import { connect } from 'react-redux';
import sc2 from 'api/sc2';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import { Button } from 'react-native-elements';
import DEBUG from 'constants/debug';
import {
  STEEM_ACCESS_TOKEN,
  AUTH_EXPIRATION,
  AUTH_MAX_EXPIRATION_AGE,
  AUTH_USERNAME,
} from 'constants/asyncStorageKeys';
import { authenticateUserError, authenticateUserSuccess } from 'state/actions/authActions';
import i18n from 'i18n/i18n';

const mapDispatchToProps = dispatch => ({
  authenticateUserSuccess: payload => dispatch(authenticateUserSuccess(payload)),
  authenticateUserError: error => dispatch(authenticateUserError(error)),
});

const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.WHITE.WHITE};
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
`;

@connect(null, mapDispatchToProps)
class SteemConnectLogin extends Component {
  static propTypes = {
    authenticateUserSuccess: PropTypes.func.isRequired,
    authenticateUserError: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);

    this.handleSteemConnectLogin = this.handleSteemConnectLogin.bind(this);
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

  renderDebugText() {
    if (DEBUG) {
      return (
        <View>
          <DebugText>{`LinkingURI: ${Expo.Constants.linkingUri}/redirect`}</DebugText>
          <DebugText>{`RedirectURI: ${AuthSession.getRedirectUrl()}`}</DebugText>
        </View>
      );
    }
  }

  render() {
    return (
      <Container>
        <Description>{i18n.login.description}</Description>
        <Button
          onPress={this.handleSteemConnectLogin}
          title="Login with SteemConnect"
          fontWeight="bold"
          borderRadius={10}
          backgroundColor={COLORS.PRIMARY_COLOR}
        />
        {this.renderDebugText()}
      </Container>
    );
  }
}

export default SteemConnectLogin;
