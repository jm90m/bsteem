import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { AsyncStorage, Modal } from 'react-native';
import sc2 from 'api/sc2';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import PrimaryButton from 'components/common/PrimaryButton';
import {
  AUTH_EXPIRATION,
  AUTH_MAX_EXPIRATION_AGE,
  AUTH_USERNAME,
  STEEM_ACCESS_TOKEN,
} from '../../constants/asyncStorageKeys';
import { FONT_SIZES } from '../../constants/styles';

const StyledWebView = styled.WebView`
  flex: 1;
`;

const Description = styled.Text`
  padding: 20px;
  font-weight: bold;
`;

const RevokeTitle = styled.Text`
  font-size: ${FONT_SIZES.TITLE};
  padding-top: 20px;
  text-align: center;
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

    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
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

  onNavigationStateChange(status) {
    console.log('ON STATE NAVIGATION', status);
  }

  render() {
    const { visible, handleHide } = this.props;
    const sc2RevokeURL = 'https://v2.steemconnect.com/revoke/@busy-mobile';
    return (
      <Modal animationType="slide" visible={visible} onRequestClose={handleHide}>
        <Header>
          <BackButton navigateBack={handleHide} />
        </Header>
        <Description>
          If you want to logout of your account, you can press the logout button below.
        </Description>
        <PrimaryButton onPress={this.handleLogout} title="Logout" />
        <RevokeTitle>Revoke SteemConnect token</RevokeTitle>
        <Description>
          If you want to switch accounts you will need to revoke the SteemConnect token by following
          the revoke form below and after it has completed press the logout button above.
        </Description>
        <StyledWebView
          source={{ uri: sc2RevokeURL }}
          onNavigationStateChange={this.onNavigationStateChange}
        />
      </Modal>
    );
  }
}

export default LogoutScreen;
