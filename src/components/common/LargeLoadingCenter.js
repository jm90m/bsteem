import React from 'react';
import styled from 'styled-components/native';
import LargeLoading from './LargeLoading';

const Container = styled.View`
  align-items: center;
  background-color: transparent;
  bottom: 0;
  flex: 1;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
`;

const LargeLoadingCenter = () => (
  <Container>
    <LargeLoading />
  </Container>
);

export default LargeLoadingCenter;
