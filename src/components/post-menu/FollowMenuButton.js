import React, { Component } from 'react';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import i18n from 'i18n/i18n';
import withFollowActions from '../decorators/withFollowActions';
import MenuModalButton from '../common/menu/MenuModalButton';
import SmallLoading from 'components/common/SmallLoading';

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

@withFollowActions
class FollowMenuButton extends Component {
  render() {
    const { loadingIsFollowing, isFollowing } = this.props;
    const onPress = isFollowing ? this.props.handleUnfollow : this.props.handleFollow;
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
          <MenuText>{text}</MenuText>
        </MenuModalContents>
      </MenuModalButton>
    );
  }
}

export default FollowMenuButton;
