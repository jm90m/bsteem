import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { AsyncStorage, Modal } from 'react-native';
import sc2 from 'api/sc2';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import PrimaryButton from 'components/common/PrimaryButton';
import i18n from 'i18n/i18n';
import SecondaryButton from 'components/common/SecondaryButton';
import Expo from 'expo';
import {
  AUTH_EXPIRATION,
  AUTH_MAX_EXPIRATION_AGE,
  AUTH_USERNAME,
  STEEM_ACCESS_TOKEN,
} from '../../constants/asyncStorageKeys';

const Description = styled.Text`
  padding: 20px;
  font-weight: bold;
`;

class LogoutScreen extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    logoutUser: PropTypes.func,
    handleHide: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    logoutUser: () => {},
    handleHide: () => {},
  };

  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  async resetAuthUserInAsyncStorage() {
    try {
      AsyncStorage.setItem(STEEM_ACCESS_TOKEN, '');
      AsyncStorage.setItem(AUTH_EXPIRATION, '');
      AsyncStorage.setItem(AUTH_USERNAME, '');
      AsyncStorage.setItem(AUTH_MAX_EXPIRATION_AGE, '');
    } catch (e) {
      console.log('FAILED TO RESET ASYNC STORAGE FOR AUTH USER');
    }
  }

  handleLogout() {
    sc2
      .revokeToken()
      .then(() => {
        this.resetAuthUserInAsyncStorage();
        this.props.logoutUser();
      })
      .catch(() => {
        // TODO errors out here, still need to fix why sc2 is breaking
        console.log('SC2 fail - but logout anyways');
        this.resetAuthUserInAsyncStorage();
        this.props.logoutUser();
      });
  }

  handleRevoke() {
    const sc2RevokeURL = 'https://v2.steemconnect.com/revoke/@bsteem';
    Expo.WebBrowser.openBrowserAsync(sc2RevokeURL).catch(error => {
      console.log('invalid url', error, sc2RevokeURL);
    });
  }

  render() {
    const { visible, handleHide } = this.props;

    return (
      <Modal animationType="slide" visible={visible} onRequestClose={handleHide}>
        <Header>
          <BackButton navigateBack={handleHide} />
        </Header>
        <Description>{i18n.logout.logoutButtonDescription}</Description>
        <PrimaryButton onPress={this.handleLogout} title={i18n.logout.logout} />
        <Description>{i18n.logout.switchAccountsDescription}</Description>
        <SecondaryButton onPress={this.handleRevoke} title={i18n.logout.revokeToken} />
      </Modal>
    );
  }
}

export default LogoutScreen;
