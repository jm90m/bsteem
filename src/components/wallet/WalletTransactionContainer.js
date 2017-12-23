import React from 'react';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';

const WalletTransactionContainer = styled.View`
  flex-direction: row;
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 2px;
  margin-bottom: 2px;
  border-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-width: 2px;
  padding: 5px;
`;

export default WalletTransactionContainer;
