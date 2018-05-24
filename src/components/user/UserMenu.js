import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import styled from 'styled-components/native';
import { ICON_SIZES } from 'constants/styles';
import { USER_MENU } from 'constants/userMenu';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import { connect } from 'react-redux';
import MenuModalButton from '../common/menu/MenuModalButton';
import MenuWrapper from '../common/menu/MenuWrapper';

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
  align-items: center;
`;

const MenuText = styled.Text`
  margin-left: 5px;
  color: ${props => props.customTheme.primaryColor};
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
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    hideMenu: PropTypes.func,
  };

  static defaultProps = {
    handleChangeUserMenu: () => {},
    hideMenu: () => {},
  };

  render() {
    const { handleChangeUserMenu, customTheme, intl } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.props.hideMenu}>
        <Container>
          <MenuWrapper>
            {_.map(USER_MENU, option => (
              <MenuModalButton onPress={() => handleChangeUserMenu(option)} key={option.id}>
                <MenuModalContents>
                  <MaterialIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    name={option.icon}
                    color={customTheme.primaryColor}
                  />
                  <MenuText customTheme={customTheme}>{_.capitalize(intl[option.label])}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            ))}
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(UserMenu);
