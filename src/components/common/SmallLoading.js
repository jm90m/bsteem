import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';

const Loading = styled.ActivityIndicator``;

const SmallLoading = ({ style }) => (
  <Loading color={COLORS.PRIMARY_COLOR} size="small" style={style} />
);

SmallLoading.propTypes = {
  style: PropTypes.shape(),
};

SmallLoading.defaultProps = {
  style: {},
};

export default SmallLoading;
