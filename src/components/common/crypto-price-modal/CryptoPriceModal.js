import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ScrollView, RefreshControl, View } from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getDisplayPriceModal,
  getDisplayedCryptos,
  getUsersDetails,
  getAuthUsername,
  getIsAuthenticated,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_ICONS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import commonStyles from 'styles/common';
import BackButton from 'components/common/BackButton';
import { hidePriceModal } from 'state/actions/appActions';
import { fetchUser } from 'state/actions/usersActions';
import WalletSummary from 'components/wallet/wallet-summary/WalletSummary';
import TitleText from 'components/common/TitleText';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import Header from '../Header';
import ClaimRewardsBlock from '../ClaimRewardsBlock';
import CryptoChart from './CryptoChart';

const mapStateToProps = state => ({
  displayPriceModal: getDisplayPriceModal(state),
  displayedCryptos: getDisplayedCryptos(state),
  usersDetails: getUsersDetails(state),
  currentAuthUsername: getAuthUsername(state),
  authenticated: getIsAuthenticated(state),
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  hidePriceModal: () => dispatch(hidePriceModal()),
  fetchUser: username => dispatch(fetchUser.action({ username })),
});

class CryptoPriceModal extends Component {
  static propTypes = {
    displayedCryptos: PropTypes.arrayOf(PropTypes.string),
    customTheme: PropTypes.shape().isRequired,
    displayPriceModal: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    hidePriceModal: PropTypes.func.isRequired,
    currentAuthUsername: PropTypes.string.isRequired,
    usersDetails: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    fetchUser: PropTypes.func.isRequired,
  };

  static defaultProps = {
    displayedCryptos: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshCharts: false,
    };
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  handleRefresh() {
    this.setState(
      {
        refreshCharts: true,
      },
      () => {
        this.setState({
          refreshCharts: false,
        });
      },
    );

    if (this.props.authenticated) {
      this.props.fetchUser(this.props.currentAuthUsername);
    }
  }

  renderCryptoCharts() {
    const { displayedCryptos } = this.props;
    const { refreshCharts } = this.state;
    if (_.isEmpty(displayedCryptos)) {
      return null;
    }

    return _.map(displayedCryptos, crypto => (
      <CryptoChart key={crypto} crypto={crypto} refreshCharts={refreshCharts} />
    ));
  }

  renderUserWallet() {
    const { currentAuthUsername, authenticated, usersDetails, intl } = this.props;

    if (!authenticated) return null;

    const user = _.get(usersDetails, currentAuthUsername, {});

    return (
      <View>
        <TitleText style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15 }}>
          {`${currentAuthUsername} ${intl.wallet}`}
        </TitleText>
        <WalletSummary user={user} />
      </View>
    );
  }

  render() {
    const { displayPriceModal, authenticated, customTheme, intl } = this.props;

    if (!displayPriceModal) return null;

    return (
      <Modal
        visible={displayPriceModal}
        animationType="slide"
        onRequestClose={this.props.hidePriceModal}
      >
        <SafeAreaView>
          <StyledViewPrimaryBackground style={commonStyles.container}>
            <Header>
              <View style={commonStyles.headerMenuIconContainer}>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuIcon}
                  name={MATERIAL_COMMUNITY_ICONS.menuVertical}
                  color="transparent"
                />
              </View>
              <TitleText>{intl.market}</TitleText>
              <BackButton
                navigateBack={this.props.hidePriceModal}
                iconName={MATERIAL_ICONS.close}
              />
            </Header>
            <ScrollView
              style={commonStyles.scrollViewEndPadding}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshCharts}
                  onRefresh={this.handleRefresh}
                  colors={[customTheme.primaryColor]}
                  tintColor={customTheme.primaryColor}
                />
              }
            >
              {this.renderUserWallet()}
              {authenticated && <ClaimRewardsBlock />}
              {this.renderCryptoCharts()}
              <View style={commonStyles.emptyView} />
            </ScrollView>
          </StyledViewPrimaryBackground>
        </SafeAreaView>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CryptoPriceModal);
