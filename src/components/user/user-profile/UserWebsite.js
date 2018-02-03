import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_COMMUNITY_ICONS, COLORS } from 'constants/styles';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Website = styled.Text`
  margin-left: 5px;
  color: ${COLORS.PRIMARY_COLOR};
`;

const UserWebsite = ({ website }) => (
  <Container>
    <MaterialCommunityIcons
      name={MATERIAL_COMMUNITY_ICONS.linkVariant}
      size={20}
      color={COLORS.GREY.CHARCOAL}
    />
    <Website>{website}</Website>
  </Container>
);

UserWebsite.propTypes = {
  website: PropTypes.string,
};

UserWebsite.defaultProps = {
  website: '',
};

export default UserWebsite;
