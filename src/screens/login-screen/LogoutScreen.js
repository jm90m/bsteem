import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Expo from 'expo';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { AsyncStorage } from 'react-native';
import sc2 from 'api/sc2';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import PrimaryButton from 'components/common/PrimaryButton';
import SecondaryButton from 'components/common/SecondaryButton';
import { logoutUser } from 'state/actions/authActions';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import { getCurrentUserSettings } from 'state/actions/settingsActions';
import { COLORS } from 'constants/styles';
import tinycolor from 'tinycolor2';
import {
  AUTH_EXPIRATION,
  AUTH_MAX_EXPIRATION_AGE,
  AUTH_USERNAME,
  STEEM_ACCESS_TOKEN,
} from '../../constants/asyncStorageKeys';

const Description = styled(StyledTextByBackground)`
  padding: 20px;
  font-weight: bold;
`;

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
  getCurrentUserSettings: () => dispatch(getCurrentUserSettings.action()),
});

class LogoutScreen extends Component {
  static propTypes = {
    logoutUser: PropTypes.func.isRequired,
    getCurrentUserSettings: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
    this.handleNavigateBack = this.handleNavigateBack.bind(this);
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

  handleNavigateBack() {
    this.props.navigation.goBack();
  }

  handleLogout() {
    sc2
      .revokeToken()
      .then(() => {
        this.resetAuthUserInAsyncStorage();
        this.props.logoutUser();
        this.props.getCurrentUserSettings();
      })
      .catch(() => {
        console.log('SC2 fail - but logout anyways');
        // TODO errors out here, still need to fix why sc2 is breaking
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
    const { customTheme, intl } = this.props;
    const primaryButtonTextColor = tinycolor(customTheme.primaryColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;
    const secondaryButtonTextColor = tinycolor(customTheme.secondaryColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.handleNavigateBack} />
        </Header>
        <Description>{intl.logout_button_description}</Description>
        <PrimaryButton
          onPress={this.handleLogout}
          title={intl.logout}
          color={primaryButtonTextColor}
        />
        <Description>{intl.switch_accounts_description}</Description>
        <SecondaryButton
          onPress={this.handleRevoke}
          title={intl.revoke_sc_token}
          color={secondaryButtonTextColor}
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutScreen);
