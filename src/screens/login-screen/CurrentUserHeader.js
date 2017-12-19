import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';

const Container = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  border-bottom-color: ${COLORS.WHITE.GAINSBORO};
  border-bottom-width: 1px;
  width: 100%;
  padding-top: 20px;
`;

const CurrentMenuDisplay = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CurrentMenuText = styled.Text`
  margin-left: 5px;
  color: ${COLORS.BLUE.MARINER};
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

const EmptyView = styled.View`
  width: 5px;
`;

class CurrentUserHeader extends Component {
  static propTypes = {
    currentMenuOption: PropTypes.shape().isRequired,
    toggleCurrentUserMenu: PropTypes.func.isRequired,
  };

  render() {
    const { currentMenuOption } = this.props;
    return (
      <Container>
        <TouchableContainer onPress={this.props.toggleCurrentUserMenu}>
          <EmptyView />
          <CurrentMenuDisplay>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={currentMenuOption.icon}
              color={COLORS.BLUE.MARINER}
            />
            <CurrentMenuText>{currentMenuOption.label}</CurrentMenuText>
          </CurrentMenuDisplay>
          <MenuIconContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.chevronDown}
            />
          </MenuIconContainer>
        </TouchableContainer>
      </Container>
    );
  }
}

export default CurrentUserHeader;
