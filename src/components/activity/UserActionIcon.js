import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as accountHistoryConstants from 'constants/accountHistory';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import Avatar from 'components/common/Avatar';
import { FEATHER_ICONS } from '../../constants/styles';

const IconContainer = styled.View`
  align-items: center;
  background-color: ${COLORS.BLUE.SOLITUDE};
  border-radius: 4px;
  display: flex;
  height: 40px;
  justify-content: center;
  width: 44px;
`;

const ICON_SIZE = 22;
const ICON_COLOR = COLORS.BLUE.HEATHER;

class UserActionIcon extends Component {
  static propTypes = {
    actionType: PropTypes.string.isRequired,
    actionDetails: PropTypes.shape().isRequired,
    currentUsername: PropTypes.string.isRequired,
  };

  getIcon() {
    const { actionType, actionDetails, currentUsername } = this.props;
    switch (actionType) {
      case accountHistoryConstants.ACCOUNT_CREATE_WITH_DELEGATION:
      case accountHistoryConstants.ACCOUNT_CREATE:
        return <MaterialIcons name={MATERIAL_ICONS.person} size={ICON_SIZE} color={ICON_COLOR} />;
      case accountHistoryConstants.ACCOUNT_UPDATE:
        return (
          <MaterialIcons name={MATERIAL_ICONS.businessCenter} size={ICON_SIZE} color={ICON_COLOR} />
        );
      case accountHistoryConstants.VOTE:
        if (currentUsername === actionDetails.voter) {
          if (actionDetails.weight > 0) {
            return (
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.voteFill}
                size={ICON_SIZE}
                color={ICON_COLOR}
              />
            );
          } else if (actionDetails.weight < 0) {
            return (
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.unvoteFill}
                size={ICON_SIZE}
                color={ICON_COLOR}
              />
            );
          }
          return (
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.voteOutline}
              size={ICON_SIZE}
              color={ICON_COLOR}
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
              color={ICON_COLOR}
            />
          );
        } else if (
          customActionType === accountHistoryConstants.FOLLOW &&
          currentUsername === customActionDetails.follower
        ) {
          return _.isEmpty(customActionDetails.what)
            ? <MaterialIcons
                name={MATERIAL_ICONS.personOutline}
                size={ICON_SIZE}
                color={ICON_COLOR}
              />
            : <MaterialIcons name={MATERIAL_ICONS.personAdd} size={ICON_SIZE} color={ICON_COLOR} />;
        }

        return null;
      }
      case accountHistoryConstants.AUTHOR_REWARD:
      case accountHistoryConstants.CURATION_REWARD:
        return <Feather name={FEATHER_ICONS.award} size={ICON_SIZE} color={ICON_COLOR} />;
      case accountHistoryConstants.COMMENT:
        if (currentUsername === actionDetails.author) {
          return (
            <MaterialIcons name={MATERIAL_ICONS.modeComment} size={ICON_SIZE} color={ICON_COLOR} />
          );
        }
        return null;
      case accountHistoryConstants.DELETE_COMMENT:
        return <MaterialIcons name={MATERIAL_ICONS.comments} size={ICON_SIZE} color={ICON_COLOR} />;
      case accountHistoryConstants.FILL_VESTING_WITHDRAW:
        return <MaterialIcons name={MATERIAL_ICONS.flashOn} size={ICON_SIZE} color={ICON_COLOR} />;
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

  // <MaterialIcons name={iconName} size={22} color={COLORS.BLUE.HEATHER} />
  render() {
    const icon = this.getIcon();
    const avatarUsername = this.getAvatarUsername();

    if (icon) {
      return (
        <IconContainer>
          {icon}
        </IconContainer>
      );
    }

    return <Avatar username={avatarUsername} size={40} />;
  }
}

export default UserActionIcon;
