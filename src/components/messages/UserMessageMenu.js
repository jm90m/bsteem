import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
  align-items: center;
`;

const MenuModalContents = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const MenuText = styled.Text`
  margin-left: 5px;
  color: ${props => props.customTheme.primaryColor};
  font-weight: bold;
`;

class UserMessageMenu extends Component {
  static propTypes = {
    hideMenu: PropTypes.func.isRequired,
    handleNavigateToUser: PropTypes.func.isRequired,
    handleBlockUser: PropTypes.func.isRequired,
    isBlocked: PropTypes.bool.isRequired,
    handleHideUserMessage: PropTypes.func.isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  render() {
    const { isBlocked, customTheme, intl } = this.props;
    const blockedText = isBlocked ? intl.unblock_user : intl.block_user;
    return (
      <TouchableWithoutFeedback onPress={this.props.hideMenu}>
        <Container>
          <MenuWrapper>
            <MenuModalButton onPress={this.props.handleNavigateToUser}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={customTheme.primaryColor}
                  name={MATERIAL_COMMUNITY_ICONS.account}
                />
                <MenuText customTheme={customTheme}>{intl.view_profile}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.props.handleBlockUser}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={customTheme.primaryColor}
                  name={MATERIAL_COMMUNITY_ICONS.block}
                />
                <MenuText customTheme={customTheme}>{blockedText}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.props.handleHideUserMessage}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={customTheme.primaryColor}
                  name={MATERIAL_COMMUNITY_ICONS.hide}
                />
                <MenuText customTheme={customTheme}>{intl.hide_messages}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default UserMessageMenu;
