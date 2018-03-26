import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { COLORS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';
import i18n from 'i18n/i18n';

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
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

class UserMessageMenu extends Component {
  static propTypes = {
    hideMenu: PropTypes.func.isRequired,
    handleNavigateToUser: PropTypes.func.isRequired,
    handleBlockUser: PropTypes.func.isRequired,
    isBlocked: PropTypes.bool.isRequired,
    handleHideUserMessage: PropTypes.func.isRequired,
  };

  render() {
    const { isBlocked } = this.props;
    const blockedText = isBlocked ? i18n.messages.unblockUser : i18n.messages.blockUser;
    return (
      <TouchableWithoutFeedback onPress={this.props.hideMenu}>
        <Container>
          <MenuWrapper>
            <MenuModalButton onPress={this.props.handleNavigateToUser}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={COLORS.PRIMARY_COLOR}
                  name={MATERIAL_COMMUNITY_ICONS.account}
                />
                <MenuText>{i18n.messages.viewProfile}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.props.handleBlockUser}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={COLORS.PRIMARY_COLOR}
                  name={MATERIAL_COMMUNITY_ICONS.block}
                />
                <MenuText>{blockedText}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.props.handleHideUserMessage}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={COLORS.PRIMARY_COLOR}
                  name={MATERIAL_COMMUNITY_ICONS.hide}
                />
                <MenuText>{i18n.messages.hideMessages}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default UserMessageMenu;
