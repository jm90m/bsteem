import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import SmallLoading from 'components/common/SmallLoading';
import i18n from 'i18n/i18n';
import withFollowActions from '../hoc/withFollowActions';
import MenuModalButton from '../common/menu/MenuModalButton';

const MenuText = styled.Text`
  margin-left: 5px;
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const MenuModalContents = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const FollowMenuButton = ({
  loadingIsFollowing,
  isFollowing,
  username,
  handleUnfollow,
  handleFollow,
}) => {
  const onPress = isFollowing ? handleUnfollow : handleFollow;
  const text = isFollowing ? i18n.postMenu.unfollow : i18n.postMenu.follow;
  const icon = isFollowing ? MATERIAL_ICONS.followed : MATERIAL_ICONS.follow;

  return (
    <MenuModalButton onPress={onPress}>
      <MenuModalContents>
        {loadingIsFollowing ? (
          <SmallLoading />
        ) : (
          <MaterialIcons
            size={ICON_SIZES.menuModalOptionIcon}
            name={icon}
            color={COLORS.PRIMARY_COLOR}
          />
        )}
        <MenuText>{`${text} ${username}`}</MenuText>
      </MenuModalContents>
    </MenuModalButton>
  );
};

FollowMenuButton.propTypes = {
  loadingIsFollowing: PropTypes.bool.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  handleUnfollow: PropTypes.func.isRequired,
  handleFollow: PropTypes.func.isRequired,
};

export default withFollowActions(FollowMenuButton);
