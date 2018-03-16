import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import Header from 'components/common/Header';

const CurrentMenuDisplay = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CurrentMenuText = styled.Text`
  margin-left: 5px;
  color: ${COLORS.PRIMARY_COLOR};
`;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const Touchable = styled.TouchableOpacity``;

class CurrentUserHeader extends Component {
  static propTypes = {
    currentMenuOption: PropTypes.shape().isRequired,
    toggleCurrentUserMenu: PropTypes.func.isRequired,
    handleNavigateToEditProfile: PropTypes.func.isRequired,
  };

  render() {
    const { currentMenuOption } = this.props;
    return (
      <Header>
        <Touchable onPress={this.props.handleNavigateToEditProfile}>
          <MenuIconContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.accountEdit}
              color={COLORS.PRIMARY_COLOR}
            />
          </MenuIconContainer>
        </Touchable>
        <Touchable onPress={this.props.toggleCurrentUserMenu}>
          <CurrentMenuDisplay>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={currentMenuOption.icon}
              color={COLORS.PRIMARY_COLOR}
            />
            <CurrentMenuText>{currentMenuOption.label}</CurrentMenuText>
          </CurrentMenuDisplay>
        </Touchable>
        <Touchable onPress={this.props.toggleCurrentUserMenu}>
          <MenuIconContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.menuVertical}
              color={COLORS.PRIMARY_COLOR}
            />
          </MenuIconContainer>
        </Touchable>
      </Header>
    );
  }
}

export default CurrentUserHeader;
