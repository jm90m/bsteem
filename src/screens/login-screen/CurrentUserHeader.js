import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.WHITE.WHITE};
  border-bottom-color: ${COLORS.WHITE.GAINSBORO};
  border-bottom-width: 1px;
  width: 100%;
  padding-top: 10px;
  min-height: 45px;
`;

const CurrentMenuDisplay = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: center;
`;

const CurrentMenuText = styled.Text`
  margin-left: 5px;
  color: ${COLORS.BLUE.MARINER};
`;

const TouchableContainer = styled.TouchableOpacity`
  flex-direction: row;
`;

const MenuIconContainer = styled.View`
  align-self: flex-end;
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
      <Container>
        <TouchableContainer onPress={this.props.toggleCurrentUserMenu}>
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
              name={MATERIAL_COMMUNITY_ICONS.menuVertical}
            />
          </MenuIconContainer>
        </TouchableContainer>
      </Container>
    );
  }
}

export default CurrentUserHeader;
