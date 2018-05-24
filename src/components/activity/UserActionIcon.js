import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as accountHistoryConstants from 'constants/accountHistory';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, FEATHER_ICONS } from 'constants/styles';
import Avatar from 'components/common/Avatar';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import tinycolor from 'tinycolor2';

const IconContainer = styled.View`
  align-items: center;
  background-color: ${props => props.customTheme.tertiaryColor};
  border-radius: 4px;
  display: flex;
  height: 40px;
  justify-content: center;
  width: 44px;
`;

const ICON_SIZE = 22;

class UserActionIcon extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    actionType: PropTypes.string.isRequired,
    actionDetails: PropTypes.shape().isRequired,
    currentUsername: PropTypes.string.isRequired,
  };

  getIcon() {
    const { actionType, actionDetails, currentUsername, customTheme } = this.props;
    const iconColor = tinycolor(customTheme.tertiaryColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;
    switch (actionType) {
      case accountHistoryConstants.ACCOUNT_CREATE_WITH_DELEGATION:
      case accountHistoryConstants.ACCOUNT_CREATE:
        return <MaterialIcons name={MATERIAL_ICONS.person} size={ICON_SIZE} color={iconColor} />;
      case accountHistoryConstants.ACCOUNT_UPDATE:
        return (
          <MaterialIcons name={MATERIAL_ICONS.businessCenter} size={ICON_SIZE} color={iconColor} />
        );
      case accountHistoryConstants.VOTE:
        if (currentUsername === actionDetails.voter) {
          if (actionDetails.weight > 0) {
            return (
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.voteFill}
                size={ICON_SIZE}
                color={iconColor}
              />
            );
          } else if (actionDetails.weight < 0) {
            return (
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.unvoteFill}
                size={ICON_SIZE}
                color={iconColor}
              />
            );
          }
          return (
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.voteOutline}
              size={ICON_SIZE}
              color={iconColor}
            />
          );
        }
        return null;
      case accountHistoryConstants.CUSTOM_JSON: {
        const actionJSON = JSON.parse(actionDetails.json);
        const customActionType = actionJSON[0];
        const customActionDetails = actionJSON[1];

        if (
          customActionType === accountHistoryConstants.REBLOG &&
          currentUsername === customActionDetails.account
        ) {
          return (
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.reblog}
              size={ICON_SIZE}
              color={iconColor}
            />
          );
        } else if (
          customActionType === accountHistoryConstants.FOLLOW &&
          currentUsername === customActionDetails.follower
        ) {
          return _.isEmpty(customActionDetails.what) ? (
            <MaterialIcons name={MATERIAL_ICONS.personOutline} size={ICON_SIZE} color={iconColor} />
          ) : (
            <MaterialIcons name={MATERIAL_ICONS.personAdd} size={ICON_SIZE} color={iconColor} />
          );
        }

        return null;
      }
      case accountHistoryConstants.AUTHOR_REWARD:
      case accountHistoryConstants.CURATION_REWARD:
        return <Feather name={FEATHER_ICONS.award} size={ICON_SIZE} color={iconColor} />;
      case accountHistoryConstants.COMMENT:
        if (currentUsername === actionDetails.author) {
          return (
            <MaterialIcons name={MATERIAL_ICONS.modeComment} size={ICON_SIZE} color={iconColor} />
          );
        }
        return null;
      case accountHistoryConstants.DELETE_COMMENT:
        return <MaterialIcons name={MATERIAL_ICONS.comments} size={ICON_SIZE} color={iconColor} />;
      case accountHistoryConstants.FILL_VESTING_WITHDRAW:
        return <MaterialIcons name={MATERIAL_ICONS.flashOn} size={ICON_SIZE} color={iconColor} />;
      default:
        return null;
    }
  }

  getAvatarUsername() {
    const { actionType, actionDetails } = this.props;
    switch (actionType) {
      case accountHistoryConstants.COMMENT:
        return actionDetails.author;
      case accountHistoryConstants.CUSTOM_JSON: {
        const actionJSON = JSON.parse(actionDetails.json);
        const customActionType = actionJSON[0];
        const customActionDetails = actionJSON[1];

        if (customActionType === accountHistoryConstants.REBLOG) {
          return customActionDetails.account;
        } else if (customActionType === accountHistoryConstants.FOLLOW) {
          return customActionDetails.follower;
        }

        return null;
      }
      case accountHistoryConstants.VOTE:
        return actionDetails.voter;
      case accountHistoryConstants.ACCOUNT_WITNESS_VOTE:
      case accountHistoryConstants.ACCOUNT_UPDATE:
        return actionDetails.account;
      default:
        return null;
    }
  }

  render() {
    const { customTheme } = this.props;
    const icon = this.getIcon();
    const avatarUsername = this.getAvatarUsername();

    if (icon) {
      return <IconContainer customTheme={customTheme}>{icon}</IconContainer>;
    }

    return <Avatar username={avatarUsername} size={40} />;
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(UserActionIcon);
