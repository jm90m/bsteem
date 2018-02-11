import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const Container = styled.Text``;

const USDValue = ({ value, style }) => (
  <Container style={style}>${parseFloat(value).toFixed(2)}</Container>
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
