import React from 'react';
import { Button } from 'react-native-elements';
import { COLORS } from '../../constants/styles';

const DangerButton = props => (
  <Button borderRadius={3} backgroundColor={COLORS.RED.VALENCIA} {...props} />
);

export default DangerButton;
