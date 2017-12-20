import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import {
  STEEM_ACCESS_TOKEN,
  AUTH_EXPIRATION,
  AUTH_USERNAME,
  AUTH_MAX_EXPIRATION_AGE,
} from 'constants/asyncStorageKeys';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import sc2 from 'api/sc2';
import { getAuthAccessToken } from 'state/rootReducer';
import { authenticateUserSuccess } from 'state/actions/authActions';
import SteemConnectLogin from './SteemConnectLogin';
import CurrentUserScreen from './CurrentUserScreen';

const Container = styled.View`
  flex: 1;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Loading = styled.ActivityIndicator`
  padding: 10px;
`;

const mapStateToProps = state => ({
  accessToken: getAuthAccessToken(state),
});

const mapDispatchToProps = dispatch => ({
  authenticateUserSuccess: payload => dispatch(authenticateUserSuccess(payload)),
});

@connect(mapStateToProps, mapDispatchToProps)
class LoginScreen extends Component {
  static propTypes = {
    accessToken: PropTypes.string,
    navigation: PropTypes.shape().isRequired,
    authenticateUserSuccess: PropTypes.func.isRequired,
  };

  static defaultProps = {
    accessToken: '',
  };

  static navigationOptions = {
    headerMode: 'none',
    tabBarIcon: ({ tintColor }) => (
      <MaterialIcons name={MATERIAL_ICONS.login} size={ICON_SIZES.tabBarIcon} color={tintColor} />
    ),
  };

  constructor(props) {
    super(props);

    this.setAccessToken = this.setAccessToken.bind(this);
  }

  componentDidMount() {
    this.setAccessToken();
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.accessToken)) {
      sc2.me(function(err, res) {
        console.log(err, res);
      });
    }
  }

  async setAccessToken() {
    const accessToken = await AsyncStorage.getItem(STEEM_ACCESS_TOKEN);
    const username = await AsyncStorage.getItem(AUTH_USERNAME);
    const expiresIn = await AsyncStorage.getItem(AUTH_EXPIRATION);
    const maxAge = await AsyncStorage.getItem(AUTH_MAX_EXPIRATION_AGE);
    const isAuthenticated = !_.isEmpty(accessToken) && !_.isEmpty(username);
    if (isAuthenticated) {
      const payload = {
        accessToken,
        expiresIn,
        username,
        maxAge,
      };
      sc2.setAccessToken(accessToken);
      this.props.authenticateUserSuccess(payload);
    }
  }

  renderLoginButton() {
    const { accessToken } = this.props;
    if (_.isEmpty(accessToken)) {
      return <SteemConnectLogin />;
    }
    return null;
  }

  renderUser() {
    if (!_.isEmpty(this.props.accessToken)) {
      console.log("RENDER LOGIN SCREEN CURRENT USER SCREEN");
      return <CurrentUserScreen navigation={this.props.navigation} />;
    }
    return null;
  }

  render() {
    // if (this.state.loading) {
    //   return (
    //     <LoadingContainer>
    //       <Loading color={COLORS.BLUE.MARINER} size="large" />
    //     </LoadingContainer>
    //   );
    // }
    return (
      <Container>
        {this.renderUser()}
        {this.renderLoginButton()}
      </Container>
    );
  }
}

export default LoginScreen;
