import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import moment from 'moment-timezone';
import i18n from 'i18n/i18n';
import UserAbout from './UserAbout';
import UserLocation from './UserLocation';
import UserWebsite from './UserWebsite';

const Container = styled.View`
  padding: 10px;
  padding-bottom: 0px;
  background-color: ${COLORS.WHITE.WHITE};
`;

const ContentContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: 5px;
`;

const ContentText = styled.Text`
  margin-left: 5px;
  color: ${COLORS.GREY.CHARCOAL};
`;

const UserProfile = ({ userProfile, userDetails }) => {
  const about = _.get(userProfile, 'about', '');
  const location = _.get(userProfile, 'location', '');
  const website = _.get(userProfile, 'website', '');
  const createdDate = _.get(userDetails, 'created');
  const formattedCreatedDate = moment(createdDate).format('MMM DD, YYYY');

  return (
    <Container>
      {!_.isEmpty(about) && <UserAbout about={about} />}
      <ContentContainer>
        <MaterialIcons name={MATERIAL_ICONS.timer} size={ICON_SIZES.userHeaderIcon} />
        <ContentText>{`${i18n.user.joinedDate}: ${formattedCreatedDate}`}</ContentText>
      </ContentContainer>
      {!_.isEmpty(location) && <UserLocation location={location} />}
      {!_.isEmpty(website) && <UserWebsite website={website} />}
    </Container>
  );
};

UserProfile.propTypes = {
  userProfile: PropTypes.shape(),
  userDetails: PropTypes.shape(),
};

UserProfile.defaultProps = {
  userProfile: {},
};

export default UserProfile;
