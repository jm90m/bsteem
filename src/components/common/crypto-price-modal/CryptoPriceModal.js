import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ScrollView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { getCryptoDetails } from 'util/cryptoUtils';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getCryptosPriceHistory,
  getDisplayPriceModal,
  getDisplayedCryptos,
  getLoadingSteemGlobalProperties,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getUsersDetails,
  getAuthUsername,
  getIsAuthenticated,
  getSteemRate,
  getLoadingUsersDetails,
} from 'state/rootReducer';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import { hidePriceModal } from 'state/actions/appActions';
import i18n from 'i18n/i18n';
import { fetchUser } from 'state/actions/usersActions';
import UserWalletSummary from 'components/wallet/UserWalletSummary';
import Header from '../Header';
import CryptoChart from './CryptoChart';

const Container = styled.View``;

const TitleText = styled.Text`
  font-weight: bold;
  color: ${COLORS.PRIMARY_COLOR};
`;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const EmptyView = styled.View`
  height: 200;
  width: 100;
`;

const UserWalletContainer = styled.View``;

const UserWalletTitleText = styled(TitleText)`
  padding: 10px 15px;
`;

const DisclaimerText = styled.Text`
  color: ${COLORS.TERTIARY_COLOR};
  padding: 10px;
`;

const mapStateToProps = state => ({
  cryptosPriceHistory: getCryptosPriceHistory(state),
  displayPriceModal: getDisplayPriceModal(state),
  displayedCryptos: getDisplayedCryptos(state),
  usersDetails: getUsersDetails(state),
  loadingSteemGlobalProperties: getLoadingSteemGlobalProperties(state),
  totalVestingFundSteem: getTotalVestingFundSteem(state),
  totalVestingShares: getTotalVestingShares(state),
  currentAuthUsername: getAuthUsername(state),
  authenticated: getIsAuthenticated(state),
  loadingUsersDetails: getLoadingUsersDetails(state),
  steemRate: getSteemRate(state),
});

const mapDispatchToProps = dispatch => ({
  hidePriceModal: () => dispatch(hidePriceModal()),
  fetchUser: username => dispatch(fetchUser.action({ username })),
});

class CryptoPriceModal extends Component {
  static propTypes = {
    displayedCryptos: PropTypes.arrayOf(PropTypes.string),
    cryptosPriceHistory: PropTypes.shape().isRequired,
    displayPriceModal: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    hidePriceModal: PropTypes.func.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    loadingSteemGlobalProperties: PropTypes.bool.isRequired,
    loadingUsersDetails: PropTypes.bool.isRequired,
    currentAuthUsername: PropTypes.string.isRequired,
    steemRate: PropTypes.string.isRequired,
    usersDetails: PropTypes.shape().isRequired,
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

  hasAPIError() {
    const { cryptosPriceHistory, displayedCryptos } = this.props;
    const apiErrors = [];

    if (_.isEmpty(cryptosPriceHistory)) {
      return false;
    }

    _.each(displayedCryptos, crypto => {
      const cryptoDetails = getCryptoDetails(crypto);
      const cryptoSymbol = _.get(cryptoDetails, 'symbol', null);
      const cryptoAPIDetails = _.get(cryptosPriceHistory, _.upperCase(cryptoSymbol), null);
      const hasAPIError =
        !(_.isUndefined(cryptoAPIDetails) || _.isNull(cryptoAPIDetails)) &&
        (cryptoAPIDetails.usdAPIError || _.isEmpty(cryptoAPIDetails.usdPriceHistory));
      if (hasAPIError) {
        apiErrors.push(cryptoDetails);
      }
    });

    return displayedCryptos.length === apiErrors.length;
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
    this.props.fetchUser(this.props.currentAuthUsername);
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
    const {
      loadingUsersDetails,
      steemRate,
      loadingSteemGlobalProperties,
      totalVestingFundSteem,
      totalVestingShares,
      currentAuthUsername,
      authenticated,
      usersDetails,
    } = this.props;

    if (!authenticated) return null;

    const user = _.get(usersDetails, currentAuthUsername, {});

    return (
      <UserWalletContainer>
        <UserWalletTitleText>{`${currentAuthUsername} ${i18n.user.wallet}`}</UserWalletTitleText>
        <UserWalletSummary
          user={user}
          loading={loadingUsersDetails}
          steemRate={steemRate}
          loadingSteemGlobalProperties={loadingSteemGlobalProperties}
          totalVestingFundSteem={totalVestingFundSteem}
          totalVestingShares={totalVestingShares}
        />
      </UserWalletContainer>
    );
  }

  render() {
    const { displayPriceModal } = this.props;

    if (!displayPriceModal) return null;

    // if (this.hasAPIError()) return <View />;

    return (
      <Modal
        visible={displayPriceModal}
        animationType="slide"
        onRequestClose={this.props.hidePriceModal}
      >
        <Container>
          <Header>
            <HeaderEmptyView />
            <TitleText>{i18n.titles.market}</TitleText>
            <BackTouchable onPress={this.props.hidePriceModal}>
              <MaterialIcons size={24} name={MATERIAL_ICONS.close} />
            </BackTouchable>
          </Header>
          <ScrollView
            style={{ paddingBottom: 200 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshCharts}
                onRefresh={this.handleRefresh}
                colors={[COLORS.PRIMARY_COLOR]}
                tintColor={COLORS.PRIMARY_COLOR}
              />
            }
          >
            {this.renderUserWallet()}
            {this.renderCryptoCharts()}
            <DisclaimerText>{i18n.general.transferDisclaimer}</DisclaimerText>
            <EmptyView />
          </ScrollView>
        </Container>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CryptoPriceModal);
