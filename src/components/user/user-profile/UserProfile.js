import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import tinycolor from 'tinycolor2';
import UserAbout from './UserAbout';
import UserLocation from './UserLocation';
import UserWebsite from './UserWebsite';

const Container = styled.View`
  padding: 10px;
  padding-bottom: 0px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const ContentContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: 5px;
`;

const ContentText = styled.Text`
  margin-left: 5px;
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const UserProfile = ({ userProfile, userDetails, customTheme, intl }) => {
  const about = _.get(userProfile, 'about', '');
  const location = _.get(userProfile, 'location', '');
  const website = _.get(userProfile, 'website', '');
  const createdDate = _.get(userDetails, 'created');
  const formattedCreatedDate = moment(createdDate).format('MMM DD, YYYY');

  return (
    <Container customTheme={customTheme}>
      {!_.isEmpty(about) && <UserAbout about={about} />}
      <ContentContainer>
        <MaterialIcons
          name={MATERIAL_ICONS.timer}
          size={ICON_SIZES.userHeaderIcon}
          color={
            tinycolor(customTheme.primaryBackgroundColor).isDark()
              ? COLORS.LIGHT_TEXT_COLOR
              : COLORS.DARK_TEXT_COLOR
          }
        />
        <ContentText customTheme={customTheme}>{`${
          intl.joined_date
        }: ${formattedCreatedDate}`}</ContentText>
      </ContentContainer>
      {!_.isEmpty(location) && <UserLocation location={location} />}
      {!_.isEmpty(website) && <UserWebsite website={website} />}
    </Container>
  );
};

UserProfile.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  userProfile: PropTypes.shape(),
  userDetails: PropTypes.shape(),
};

UserProfile.defaultProps = {
  userProfile: {},
  userDetails: {},
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(UserProfile);
