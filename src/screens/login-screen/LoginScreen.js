import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import Expo, { AuthSession } from 'expo';
import sc2 from 'api/sc2';
import { getAuthAccessToken, getAuthExpiresIn, getAuthUsername } from 'state/rootReducer';
import {
  authenticateUserError,
  authenticateUserSuccess,
  logoutUser,
} from 'state/actions/authActions';
import CurrentUserScreen from './CurrentUserScreen';

const Container = styled.View`
  flex: 1;
`;

const Button = styled.Button``;

const mapStateToProps = state => ({
  accessToken: getAuthAccessToken(state),
  expiresIn: getAuthExpiresIn(state),
  username: getAuthUsername(state),
});

const mapDispatchToProps = dispatch => ({
  authenticateUserSuccess: payload => dispatch(authenticateUserSuccess(payload)),
  authenticateUserError: error => dispatch(authenticateUserError(error)),
  logoutUser: () => dispatch(logoutUser()),
});

@connect(mapStateToProps, mapDispatchToProps)
class LoginScreen extends Component {
  static propTypes = {
    authenticateUserSuccess: PropTypes.func.isRequired,
    authenticateUserError: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    headerMode: 'none',
    tabBarIcon: ({ tintColor }) => (
      <MaterialIcons name={'account-circle'} size={20} color={tintColor} />
    ),
  };

  _handlePressAsync = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    const url = sc2.getLoginURL({ authenticated: true });
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
      this.props.authenticateUserSuccess(response);
    } else {
      this.props.authenticateUserError();
    }
  };

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.accessToken)) {
      sc2.me(function(err, res) {
        console.log(err, res);
      });
    }
  }

  renderLoginButton() {
    const { accessToken } = this.props;
    if (_.isEmpty(accessToken)) {
      return <Button onPress={this._handlePressAsync} title={'Login'} />;
    }
    return null;
  }

  renderUser() {
    if (!_.isEmpty(this.props.username)) {
      return <CurrentUserScreen navigation={this.props.navigation} />;
    }
    return null;
  }

  render() {
    return (
      <Container>
        {this.renderUser()}
        {this.renderLoginButton()}
      </Container>
    );
  }
}

export default LoginScreen;
