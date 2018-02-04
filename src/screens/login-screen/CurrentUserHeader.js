import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';

const CurrentMenuDisplay = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CurrentMenuText = styled.Text`
  margin-left: 5px;
  color: ${COLORS.PRIMARY_COLOR};
`;

const TouchableContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

class CurrentUserHeader extends Component {
  static propTypes = {
    currentMenuOption: PropTypes.shape().isRequired,
    toggleCurrentUserMenu: PropTypes.func.isRequired,
  };

  render() {
    const { currentMenuOption } = this.props;
    return (
      <TouchableContainer onPress={this.props.toggleCurrentUserMenu}>
        <Header>
          <HeaderEmptyView />
          <CurrentMenuDisplay>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={currentMenuOption.icon}
              color={COLORS.PRIMARY_COLOR}
            />
            <CurrentMenuText>{currentMenuOption.label}</CurrentMenuText>
          </CurrentMenuDisplay>
          <MenuIconContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.menuVertical}
            />
          </MenuIconContainer>
        </Header>
      </TouchableContainer>
    );
  }
}

export default CurrentUserHeader;
