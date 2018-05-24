import React from 'react';
import PropTypes from 'prop-types';
import StyledTextByBackground from 'components/common/StyledTextByBackground';

const USDValue = ({ value, style }) => (
  <StyledTextByBackground style={style}>${parseFloat(value).toFixed(2)}</StyledTextByBackground>
);

USDValue.propTypes = {
  value: PropTypes.number,
  style: PropTypes.shape(),
};

USDValue.defaultProps = {
  value: 0,
  style: {},
};

export default USDValue;
