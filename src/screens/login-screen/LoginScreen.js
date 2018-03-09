import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { getAuthAccessToken } from 'state/rootReducer';
import SteemConnectLogin from './SteemConnectLogin';
import CurrentUserProfileScreen from './CurrentUserProfileScreen';

const Container = styled.View`
  flex: 1;
`;

const mapStateToProps = state => ({
  accessToken: getAuthAccessToken(state),
});

@connect(mapStateToProps, null)
class LoginScreen extends Component {
  static propTypes = {
    accessToken: PropTypes.string,
    navigation: PropTypes.shape().isRequired,
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

  renderLoginButton() {
    const { accessToken, navigation } = this.props;
    if (_.isEmpty(accessToken)) {
      return <SteemConnectLogin navigation={navigation} />;
    }
    return null;
  }

  renderUser() {
    if (!_.isEmpty(this.props.accessToken)) {
      console.log('RENDER LOGIN SCREEN CURRENT USER SCREEN');
      return <CurrentUserProfileScreen navigation={this.props.navigation} />;
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
