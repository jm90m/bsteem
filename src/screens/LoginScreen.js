import React, { Component } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Expo, { AuthSession } from 'expo';
import sc2 from '../api/sc2';
import { connect } from 'react-redux';
import { getAccessToken, getExpiresIn, getUsername } from '../state/reducers/authReducer';
import { authenticateUserError, authenticateUserSuccess } from '../state/actions/authActions';
import _ from 'lodash';

const Container = styled.View`
  margin-top: 10px;
`;

const Button = styled.Button``;

const UserContainer = styled.View`
  margin-top: 10px;
`;

const Username = styled.Text``;

const mapStateToProps = state => ({
  accessToken: getAccessToken(state),
  expiresIn: getExpiresIn(state),
  username: getUsername(state),
});

const mapDispatchToProps = dispatch => ({
  authenticateUserSuccess: payload => dispatch(authenticateUserSuccess(payload)),
  authenticateUserError: error => dispatch(authenticateUserError(error)),
});

@connect(mapStateToProps, mapDispatchToProps)
class LoginScreen extends Component {
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
      const response = {
        accessToken: result.params.access_token,
        expiresIn: result.params.expires_in,
        username: result.params.username,
      };
      sc2.setAccessToken(result.params.access_token);
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
  }

  renderUser() {
    if (!_.isEmpty(this.props.username)) {
      return (
        <UserContainer>
          <Username>{this.props.username}</Username>
        </UserContainer>
      );
    }
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
