import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import { FONT_AWESOME_ICONS, ICON_COLORS, ICON_SIZES } from 'constants/styles';
import TimeAgo from 'components/common/TimeAgo';
import i18n from 'i18n/i18n';
import WalletTransactionContainer from './WalletTransactionContainer';
import IconContainer from './IconContainer';

const Label = styled.Text`
  font-weight: bold;
  padding-left: 10px;
`;
const Value = styled.Text`
  font-weight: bold;
  margin-left: auto;
`;

const PowerUpTransaction = ({ timestamp, amount }) => (
  <WalletTransactionContainer>
    <IconContainer>
      <FontAwesome
        name={FONT_AWESOME_ICONS.bolt}
        size={ICON_SIZES.actionIcon}
        color={ICON_COLORS.actionIcon}
      />
    </IconContainer>
    <View>
      <Label>{i18n.activity.powerUp}</Label>
      <TimeAgo created={timestamp} style={{ marginLeft: 10 }} />
    </View>
    <Value>{amount}</Value>
  </WalletTransactionContainer>
);

PowerUpTransaction.propTypes = {
  timestamp: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
};

export default PowerUpTransaction;
