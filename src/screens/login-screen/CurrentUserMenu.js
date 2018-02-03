import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { CURRENT_USER_MENU } from 'constants/userMenu';
import { COLORS } from 'constants/styles';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
  align-items: center;
`;

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

class CurrentUserMenu extends Component {
  static propTypes = {
    hideMenu: PropTypes.func.isRequired,
    handleChangeUserMenu: PropTypes.func.isRequired,
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.hideMenu}>
        <Container>
          <MenuWrapper>
            {_.map(CURRENT_USER_MENU, option => (
              <MenuModalButton
                onPress={() => this.props.handleChangeUserMenu(option)}
                key={option.id}
              >
                <MenuModalContents>
                  <MaterialIcons size={20} name={option.icon} color={COLORS.PRIMARY_COLOR} />
                  <MenuText>
                    {option.label}
                  </MenuText>
                </MenuModalContents>
              </MenuModalButton>
            ))}
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default CurrentUserMenu;
