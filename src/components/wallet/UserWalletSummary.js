import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { COLORS, FONT_AWESOME_ICONS, MATERIAL_ICONS } from 'constants/styles';
import steem from 'steem';
import SmallLoading from 'components/common/SmallLoading';
import { calculateEstAccountValue, calculateTotalDelegatedSP } from 'util/steemitUtils';

const SteemLogo = require('images/steem.png');

const Container = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  margin-bottom: 10px;
  border-top-width: 1px;
  border-top-color: ${COLORS.WHITE.GAINSBORO};
  border-bottom-width: 1px;
  border-bottom-color: ${COLORS.WHITE.GAINSBORO};
`;

const UserWalletSummaryItem = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${COLORS.WHITE.GAINSBORO};
  align-items: center;
  margin: 0 15px;
  flex-direction: row;
  padding: 10px 0;
`;

const LastUserWalletSummaryItem = styled(UserWalletSummaryItem)`
  border-bottom-width: 0;
`;

const Label = styled.Text`
  margin-left: 5px;
`;

const Value = styled.Text`
  margin-left: auto;
  color: ${COLORS.BLUE.MARINER};
  font-weight: bold;
`;

const IconContainer = styled.View`
  width: 22px;
`;

const SteemImage = styled.Image`
  width: 22px;
  height: 22px;
`;

const TotalDelegatedSPText = styled.Text`
  color: ${COLORS.BLUE.MARINER};
  font-weight: bold;
`;

const getFormattedTotalDelegatedSP = (user, totalVestingShares, getTotalVestingFundSteem) => {
  const totalDelegatedSPValue = calculateTotalDelegatedSP(
    user,
    totalVestingShares,
    getTotalVestingFundSteem,
  );
  const totalDelegatedSPTextPrefix = totalDelegatedSPValue > 0 ? '(+' : '(';
  const totalDelegatedSP = `${totalDelegatedSPTextPrefix}${parseFloat(totalDelegatedSPValue).toFixed(3)} SP)`;
  if (totalDelegatedSPValue !== 0) {
    return <TotalDelegatedSPText>{totalDelegatedSP}</TotalDelegatedSPText>;
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
}) => {
  const loaderStyles = {
    marginLeft: 'auto',
  };

  return (
    <Container>
      <UserWalletSummaryItem>
        <SteemImage source={SteemLogo} resizeMode="contain" />
        <Label>{'Steem'}</Label>
        {loading
          ? <SmallLoading style={loaderStyles} />
          : <Value>{`${parseFloat(user.balance)} STEEEM`}</Value>}
      </UserWalletSummaryItem>
      <UserWalletSummaryItem>
        <IconContainer>
          <FontAwesome name={FONT_AWESOME_ICONS.bolt} size={24} color={COLORS.BLUE.BALI_HAI} />
        </IconContainer>
        <Label>{'Steem Power'}</Label>
        {loading || loadingGlobalProperties
          ? <SmallLoading style={loaderStyles} />
          : <Value>
              {`${parseFloat(steem.formatter
                  .vestToSteem(user.vesting_shares, totalVestingShares, totalVestingFundSteem)
                  .toFixed(3))} SP `}
              {getFormattedTotalDelegatedSP(user, totalVestingShares, totalVestingFundSteem)}
            </Value>}
      </UserWalletSummaryItem>
      <UserWalletSummaryItem>
        <IconContainer>
          <FontAwesome name={FONT_AWESOME_ICONS.dollar} size={24} color={COLORS.BLUE.BALI_HAI} />
        </IconContainer>
        <Label>{'Steem Dollar'}</Label>
        {loading
          ? <SmallLoading style={loaderStyles} />
          : <Value>
              {`${parseFloat(user.sbd_balance).toFixed(3)} SBD`}
            </Value>}
      </UserWalletSummaryItem>
      <UserWalletSummaryItem>
        <IconContainer>
          <FontAwesome name={FONT_AWESOME_ICONS.bank} size={22} color={COLORS.BLUE.BALI_HAI} />
        </IconContainer>
        <Label>{'Savings'}</Label>
        {loading
          ? <SmallLoading style={loaderStyles} />
          : <Value>
              {`${parseFloat(user.savings_balance).toFixed(3)} STEEM, ${parseFloat(user.savings_sbd_balance).toFixed(3)} SBD`}
            </Value>}
      </UserWalletSummaryItem>
      <LastUserWalletSummaryItem>
        <IconContainer>
          <MaterialIcons name={MATERIAL_ICONS.person} size={25} color={COLORS.BLUE.BALI_HAI} />
        </IconContainer>
        <Label>{'Est. Account Value'}</Label>
        {loading || loadingGlobalProperties
          ? <SmallLoading style={loaderStyles} />
          : <Value>
              {`$${parseFloat(calculateEstAccountValue(user, totalVestingShares, totalVestingFundSteem, steemRate)).toFixed(2)}`}
            </Value>}
      </LastUserWalletSummaryItem>
    </Container>
  );
};

UserWalletSummary.propTypes = {
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

export default UserWalletSummary;
