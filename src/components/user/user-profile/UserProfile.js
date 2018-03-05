import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import UserAbout from './UserAbout';
import UserLocation from './UserLocation';
import UserWebsite from './UserWebsite';

const Container = styled.View`
  padding: ${props => (props.isEmpty ? '0px' : '10px')};
  background-color: ${COLORS.WHITE.WHITE};
`;

const UserProfile = ({ userProfile }) => {
  const about = _.get(userProfile, 'about', '');
  const location = _.get(userProfile, 'location', '');
  const website = _.get(userProfile, 'website', '');
  const isEmpty = _.isEmpty(about) && _.isEmpty(location) && _.isEmpty(website);

  return (
    <Container isEmpty={isEmpty}>
      {!_.isEmpty(about) && <UserAbout about={about} />}
      {!_.isEmpty(location) && <UserLocation location={location} />}
      {!_.isEmpty(website) && <UserWebsite website={website} />}
    </Container>
  );
};

UserProfile.propTypes = {
  userProfile: PropTypes.shape(),
};

UserProfile.defaultProps = {
  userProfile: {},
};

export default UserProfile;
