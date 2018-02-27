import React from 'react';
import { Button } from 'react-native-elements';
import { COLORS } from '../../constants/styles';

const SecondaryButton = props => (
  <Button borderRadius={3} backgroundColor={COLORS.SECONDARY_COLOR} {...props} />
);

export default SecondaryButton;
