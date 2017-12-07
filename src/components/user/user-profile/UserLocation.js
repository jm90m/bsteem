import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Location = styled.Text`
  margin-left: 5px;
  color: ${COLORS.GREY.CHARCOAL};
`;

const UserLocation = ({ location }) => (
  <Container>
    <MaterialIcons name={MATERIAL_ICONS.location} size={20} color={COLORS.GREY.CHARCOAL} />
    <Location>{location}</Location>
  </Container>
);

UserLocation.propTypes = {
  location: PropTypes.string,
};

UserLocation.defaultProps = {
  location: '',
};

export default UserLocation;
