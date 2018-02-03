import React from 'react';
import { Button } from 'react-native-elements';
import { COLORS } from '../../constants/styles';

const PrimaryButton = props => <Button rounded backgroundColor={COLORS.PRIMARY_COLOR} {...props} />;
export default PrimaryButton;
