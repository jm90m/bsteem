import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, FONT_AWESOME_ICONS, ICON_COLORS, ICON_SIZES } from 'constants/styles';
import WalletTransactionContainer from './WalletTransactionContainer';
import IconContainer from './IconContainer';

const TimeStamp = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
  padding-left: 10px;
`;

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
      <Label>
        {'Power up'}
      </Label>
      <TimeStamp>
        {timestamp}
      </TimeStamp>
    </View>
    <Value>
      {amount}
    </Value>
  </WalletTransactionContainer>
);

PowerUpTransaction.propTypes = {
  timestamp: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
};

export default PowerUpTransaction;
