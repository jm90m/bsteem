import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';
import MenuIcon from 'components/common/menu/MenuIcon';
import MenuModalContents from 'components/common/menu/MenuModalContents';
import MenuText from 'components/common/menu/MenuText';

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
  align-items: center;
`;

class UserMessageMenu extends Component {
  static propTypes = {
    hideMenu: PropTypes.func.isRequired,
    handleNavigateToUser: PropTypes.func.isRequired,
    handleBlockUser: PropTypes.func.isRequired,
    isBlocked: PropTypes.bool.isRequired,
    handleHideUserMessage: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  render() {
    const { isBlocked, intl } = this.props;
    const blockedText = isBlocked ? intl.unblock_user : intl.block_user;
    return (
      <TouchableWithoutFeedback onPress={this.props.hideMenu}>
        <Container>
          <MenuWrapper>
            <MenuModalButton onPress={this.props.handleNavigateToUser}>
              <MenuModalContents>
                <MenuIcon name={MATERIAL_COMMUNITY_ICONS.account} />
                <MenuText>{intl.view_profile}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.props.handleBlockUser}>
              <MenuModalContents>
                <MenuIcon name={MATERIAL_COMMUNITY_ICONS.block} />
                <MenuText>{blockedText}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.props.handleHideUserMessage} isLastElement>
              <MenuModalContents>
                <MenuIcon name={MATERIAL_COMMUNITY_ICONS.hide} />
                <MenuText>{intl.hide_messages}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default UserMessageMenu;
