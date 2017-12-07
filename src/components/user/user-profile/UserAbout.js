import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';

const Container = styled.View`
  flex-direction: row;
  padding-bottom: 5px;
`;

const About = styled.Text`
  color: ${COLORS.GREY.CHARCOAL};
`;

const UserAbout = ({ about }) => (
  <Container>
    <About>{about}</About>
  </Container>
);

UserAbout.propTypes = {
  about: PropTypes.string,
};

UserAbout.defaultProps = {
  about: '',
};

export default UserAbout;
