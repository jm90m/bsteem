import React from 'react';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { COLORS, FONT_AWESOME_ICONS, MATERIAL_ICONS } from 'constants/styles';
import steem from 'steem';
import SmallLoading from 'components/common/SmallLoading';
import { calculateEstAccountValue } from 'util/steemitUtils';

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
`;

const IconContainer = styled.View`
  width: 22px;
`;

const SteemImage = styled.Image`
  width: 22px;
  height: 22px;
`;

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
              {`${parseFloat(steem.formatter.vestToSteem(user.vesting_shares, totalVestingShares, totalVestingFundSteem))} SP`}
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
              {`${parseFloat(user.sbd_balance)} SBD`}
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
              {`${parseFloat(user.savings_balance)} STEEM, ${parseFloat(user.savings_sbd_balance)} SBD`}
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
              {`$${calculateEstAccountValue(user, totalVestingShares, totalVestingFundSteem, steemRate)}`}
            </Value>}
      </LastUserWalletSummaryItem>
    </Container>
  );
};

export default UserWalletSummary;
