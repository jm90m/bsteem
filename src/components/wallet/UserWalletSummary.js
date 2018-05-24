import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Dimensions } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { COLORS, FONT_AWESOME_ICONS, MATERIAL_ICONS } from 'constants/styles';
import { vestToSteem, numberWithCommas } from 'util/steemitFormatters';
import SmallLoading from 'components/common/SmallLoading';
import { calculateEstAccountValue, calculateTotalDelegatedSP } from 'util/steemitUtils';
import { getCustomTheme } from 'state/rootReducer';
import { connect } from 'react-redux';
import tinycolor from 'tinycolor2';
import StyledTextByBackground from 'components/common/StyledTextByBackground';

const SteemLogo = require('images/steem.png');

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View`
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  margin-bottom: 10px;
  border-top-width: 1px;
  border-top-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
`;

const UserWalletSummaryItem = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  align-items: center;
  margin: 0 15px;
  flex-direction: row;
  padding: 10px 0;
`;

const LastUserWalletSummaryItem = styled(UserWalletSummaryItem)`
  border-bottom-width: 0;
`;

const Label = styled(StyledTextByBackground)`
  margin-left: 5px;
`;

const Value = styled.Text`
  margin-left: auto;
  color: ${props => props.customTheme.primaryColor};
  font-weight: bold;
  flex-wrap: wrap;
  max-width: ${deviceWidth - 100}px;
`;

const IconContainer = styled.View`
  width: 22px;
`;

const SteemImage = styled.Image`
  width: 22px;
  height: 22px;
`;

const getFormattedTotalDelegatedSP = (user, totalVestingShares, getTotalVestingFundSteem) => {
  const totalDelegatedSPValue = calculateTotalDelegatedSP(
    user,
    totalVestingShares,
    getTotalVestingFundSteem,
  );
  const totalDelegatedSPTextPrefix = totalDelegatedSPValue > 0 ? '(+' : '(';
  const totalDelegatedSP = `${totalDelegatedSPTextPrefix}${numberWithCommas(
    parseFloat(totalDelegatedSPValue).toFixed(3),
  )} SP)`;
  if (totalDelegatedSPValue !== 0) {
    return (
      <StyledTextByBackground style={{ fontWeight: 'bold' }}>
        {totalDelegatedSP}
      </StyledTextByBackground>
    );
  }
  return null;
};

const UserWalletSummary = ({
  user,
  loading,
  totalVestingShares,
  totalVestingFundSteem,
  loadingGlobalProperties,
  steemRate,
  customTheme,
}) => {
  const loaderStyles = {
    marginLeft: 'auto',
  };
  const userBalance = parseFloat(user.balance);
  const steemPower = parseFloat(
    vestToSteem(user.vesting_shares, totalVestingShares, totalVestingFundSteem).toFixed(3),
  );
  const sbdBalance = parseFloat(user.sbd_balance).toFixed(3);
  const estAccountValue = parseFloat(
    calculateEstAccountValue(user, totalVestingShares, totalVestingFundSteem, steemRate),
  ).toFixed(2);
  const savingsBalance = parseFloat(user.savings_balance).toFixed(3);
  const sbdSavingsBalance = parseFloat(user.savings_sbd_balance).toFixed(3);

  return (
    <Container customTheme={customTheme}>
      <UserWalletSummaryItem customTheme={customTheme}>
        <SteemImage source={SteemLogo} resizeMode="contain" />
        <Label>Steem</Label>
        {loading ? (
          <SmallLoading style={loaderStyles} />
        ) : (
          <Value customTheme={customTheme}>
            {`${numberWithCommas(_.isNaN(userBalance) ? 0 : userBalance)} STEEEM`}
          </Value>
        )}
      </UserWalletSummaryItem>
      <UserWalletSummaryItem customTheme={customTheme}>
        <IconContainer>
          <FontAwesome
            name={FONT_AWESOME_ICONS.bolt}
            size={24}
            color={
              tinycolor(customTheme.primaryBackgroundColor).isDark()
                ? COLORS.LIGHT_TEXT_COLOR
                : COLORS.DARK_TEXT_COLOR
            }
          />
        </IconContainer>
        <Label>Steem Power</Label>
        {loading || loadingGlobalProperties ? (
          <SmallLoading style={loaderStyles} />
        ) : (
          <Value customTheme={customTheme}>
            {`${numberWithCommas(_.isNaN(steemPower) ? 0 : steemPower)} SP `}
            {getFormattedTotalDelegatedSP(user, totalVestingShares, totalVestingFundSteem)}
          </Value>
        )}
      </UserWalletSummaryItem>
      <UserWalletSummaryItem customTheme={customTheme}>
        <IconContainer>
          <FontAwesome
            name={FONT_AWESOME_ICONS.dollar}
            size={24}
            color={
              tinycolor(customTheme.primaryBackgroundColor).isDark()
                ? COLORS.LIGHT_TEXT_COLOR
                : COLORS.DARK_TEXT_COLOR
            }
          />
        </IconContainer>
        <Label customTheme={customTheme}>Steem Dollar</Label>
        {loading ? (
          <SmallLoading style={loaderStyles} />
        ) : (
          <Value customTheme={customTheme}>
            {`${numberWithCommas(_.isNaN(sbdBalance) ? 0 : sbdBalance)} SBD`}
          </Value>
        )}
      </UserWalletSummaryItem>
      <UserWalletSummaryItem customTheme={customTheme}>
        <IconContainer>
          <FontAwesome
            name={FONT_AWESOME_ICONS.bank}
            size={22}
            color={
              tinycolor(customTheme.primaryBackgroundColor).isDark()
                ? COLORS.LIGHT_TEXT_COLOR
                : COLORS.DARK_TEXT_COLOR
            }
          />
        </IconContainer>
        <Label>Savings</Label>
        {loading ? (
          <SmallLoading style={loaderStyles} />
        ) : (
          <Value customTheme={customTheme}>
            {`${numberWithCommas(_.isNaN(savingsBalance) ? 0 : savingsBalance)} STEEM, ${
              _.isNaN(sbdSavingsBalance) ? 0 : sbdSavingsBalance
            } SBD`}
          </Value>
        )}
      </UserWalletSummaryItem>
      <LastUserWalletSummaryItem customTheme={customTheme}>
        <IconContainer>
          <MaterialIcons
            name={MATERIAL_ICONS.person}
            size={25}
            color={
              tinycolor(customTheme.primaryBackgroundColor).isDark()
                ? COLORS.LIGHT_TEXT_COLOR
                : COLORS.DARK_TEXT_COLOR
            }
          />
        </IconContainer>
        <Label>Est. Account Value</Label>
        {loading || loadingGlobalProperties ? (
          <SmallLoading style={loaderStyles} />
        ) : (
          <Value customTheme={customTheme}>
            {`$${numberWithCommas(_.isNaN(estAccountValue) ? '0' : estAccountValue)}`}
          </Value>
        )}
      </LastUserWalletSummaryItem>
    </Container>
  );
};

UserWalletSummary.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
  loading: PropTypes.bool,
  totalVestingShares: PropTypes.string,
  totalVestingFundSteem: PropTypes.string,
  loadingGlobalProperties: PropTypes.bool,
  steemRate: PropTypes.string,
};

UserWalletSummary.defaultProps = {
  user: {},
  loading: false,
  totalVestingShares: '',
  totalVestingFundSteem: '',
  loadingGlobalProperties: false,
  steemRate: '',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(UserWalletSummary);
