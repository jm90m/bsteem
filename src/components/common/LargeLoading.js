import React from 'react';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';

const Loading = styled.ActivityIndicator``;

const LargeLoading = () => <Loading color={COLORS.BLUE.MARINER} size="large" />;

export default LargeLoading;
