import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import { USER_MENU } from 'constants/userMenu';
import MenuModalButton from '../common/menu/MenuModalButton';
import MenuWrapper from '../common/menu/MenuWrapper';

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

class UserMenu extends Component {
  static propTypes = {
    handleChangeUserMenu: PropTypes.func,
    hideMenu: PropTypes.func,
  };

  static defaultProps = {
    handleChangeUserMenu: () => {},
    hideMenu: () => {},
  };

  render() {
    const { handleChangeUserMenu } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.props.hideMenu}>
        <Container>
          <MenuWrapper>
            {_.map(USER_MENU, option => (
              <MenuModalButton onPress={() => handleChangeUserMenu(option)} key={option.id}>
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

export default UserMenu;
