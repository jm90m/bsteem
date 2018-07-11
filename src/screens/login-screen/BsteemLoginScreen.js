import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, View, TouchableWithoutFeedback } from 'react-native';
import Expo, { AuthSession } from 'expo';
import { connect } from 'react-redux';
import sc2 from 'api/sc2';
import styled from 'styled-components/native';
import firebase from 'firebase';
import _ from 'lodash';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import PrimaryButton from 'components/common/PrimaryButton';
import { MaterialIcons } from '@expo/vector-icons';
import DEBUG from 'constants/debug';
import {
  STEEM_ACCESS_TOKEN,
  AUTH_EXPIRATION,
  AUTH_MAX_EXPIRATION_AGE,
  AUTH_USERNAME,
  IS_FIREBASE_LOGIN,
} from 'constants/asyncStorageKeys';
import * as authActions from 'state/actions/authActions';
import * as navigationConstants from 'constants/navigation';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import TitleText from 'components/common/TitleText';
import { getCustomTheme, getIntl } from 'state/rootReducer';

const Container = styled.View``;

const ContentContainer = styled(StyledViewPrimaryBackground)`
  align-items: center;
  height: 100%;
`;

const DebugText = styled(StyledTextByBackground)`
  padding: 20px;
`;

const ButtonContainer = styled.View`
  margin-top: 20px;
`;

const TouchableSettings = styled.TouchableOpacity``;

const SettingsIconContainer = styled.View``;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  authenticateUserSuccess: payload => dispatch(authActions.authenticateUser.success(payload)),
  authenticateUserError: error => dispatch(authActions.authenticateUser.fail(error)),
});

class BsteemLoginScreen extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    authenticateUserSuccess: PropTypes.func.isRequired,
    authenticateUserError: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      displayDebug: false,
    };

    this.handleSteemConnectLogin = this.handleSteemConnectLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.displayDebugText = this.displayDebugText.bind(this);
    this.navigateToSettings = this.navigateToSettings.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  }

  async handleSteemConnectLogin() {
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

  async handleGoogleLogin() {
    try {
      const options = {
        behavior: 'web',
        androidClientId: '677387011407-tno4694qddu0qeuuappc6qtggilv6o81.apps.googleusercontent.com',
        iosClientId: '677387011407-9j6serl8v4f6678rfekuvc3dj20k6s2u.apps.googleusercontent.com',
        webClientId: '677387011407-pqk4huqvjpch06k607q2243rklb12v9r.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      };
      const result = await Expo.Google.logInAsync(options);

      debugger;
    } catch (e) {
      console.log('GOOGLE LOGIN ERROR');
    }
  }

  async handleFacebookLogin() {
    let redirectUrl = AuthSession.getRedirectUrl();

    // You need to add this url to your authorized redirect urls on your Facebook app
    console.log({ redirectUrl });

    // NOTICE: Please do not actually request the token on the client (see:
    // response_type=token in the authUrl), it is not secure. Request a code
    // instead, and use this flow:
    // https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/#confirm
    // The code here is simplified for the sake of demonstration. If you are
    // just prototyping then you don't need to concern yourself with this and
    // can copy this example, but be aware that this is not safe in production.

    let result = await AuthSession.startAsync({
      authUrl:
        `https://www.facebook.com/v3.0/dialog/oauth?response_type=token,granted_scopes` +
        `&client_id=${418821005285611}` +
        `&redirect_uri=${redirectUrl}` +
        `&scope=email,user_friends,user_gender`,
    });

    console.log('FACEBOOK STATUS', result);
    if (result.type === 'success') {
      const token = _.get(result, 'params.access_token');
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
      firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential)
        .then(result => {
          const profileData = _.get(result, 'additionalUserInfo.profile', {});
          const email = _.get(profileData, 'email', '');
          const response = {
            username: email,
            accessToken: token,
          };
          AsyncStorage.setItem(STEEM_ACCESS_TOKEN, token);
          AsyncStorage.setItem(AUTH_USERNAME, email);
          AsyncStorage.setItem(IS_FIREBASE_LOGIN, 'true');
          this.props.authenticateUserSuccess(response);
          console.log('FIREBASE SUCCESS WITH FB', result);
        })
        .catch(error => {
          // Handle Errors here.
          console.log('UNABLE TO LOGIN WITH FB');
        });
    }
  }

  navigateToSettings() {
    this.props.navigation.navigate(navigationConstants.SETTINGS);
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

    return null;
  }

  render() {
    const { customTheme, intl } = this.props;

    return (
      <Container>
        <Header>
          <HeaderEmptyView />
          <TitleText>{intl.login}</TitleText>
          <TouchableSettings onPress={this.navigateToSettings}>
            <SettingsIconContainer>
              <MaterialIcons
                name={MATERIAL_ICONS.settings}
                size={24}
                color={customTheme.primaryColor}
                style={{ padding: 5 }}
              />
            </SettingsIconContainer>
          </TouchableSettings>
        </Header>
        <ContentContainer>
          <TouchableWithoutFeedback onLongPress={this.displayDebugText}>
            <TitleText style={{ fontSize: 24, marginTop: 40 }}>bSteem</TitleText>
          </TouchableWithoutFeedback>
          <ButtonContainer>
            <PrimaryButton
              onPress={this.handleFacebookLogin}
              title={intl.log_in_with_facebook}
              icon={{ name: 'facebook-official', type: 'font-awesome' }}
              fontWeight="bold"
              backgroundColor={'#717dba'}
              color={'#fff'}
            />
          </ButtonContainer>
          <ButtonContainer>
            <PrimaryButton
              onPress={this.handleGoogleLogin}
              fontWeight="bold"
              icon={{ name: 'google', type: 'font-awesome' }}
              title={intl.log_in_with_google}
              backgroundColor="#d25036"
              color={'#fff'}
            />
          </ButtonContainer>
          {this.renderDebugText()}
        </ContentContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BsteemLoginScreen);
