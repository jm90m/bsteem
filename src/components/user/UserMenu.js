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
import Modal from 'react-native-modal';
import tinycolor from 'tinycolor2';
import MenuModalButton from '../common/menu/MenuModalButton';
import MenuWrapper from '../common/menu/MenuWrapper';
import MenuText from '../common/menu/MenuText';
import MenuModalContents from '../common/menu/MenuModalContents';
import { COLORS } from '../../constants/styles';

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
  align-items: center;
`;

class UserMenu extends React.PureComponent {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    handleChangeUserMenu: PropTypes.func,
    hideMenu: PropTypes.func,
    menuVisible: PropTypes.bool,
  };

  static defaultProps = {
    handleChangeUserMenu: () => {},
    hideMenu: () => {},
    menuVisible: false,
  };

  render() {
    const { handleChangeUserMenu, customTheme, intl, menuVisible } = this.props;

    return (
      <Modal
        isVisible={menuVisible}
        onBackdropPress={this.props.hideMenu}
        onBackButtonPress={this.props.hideMenu}
      >
        <TouchableWithoutFeedback onPress={this.props.hideMenu}>
          <Container>
            <MenuWrapper>
              {_.map(USER_MENU, (option, index) => (
                <MenuModalButton
                  onPress={() => handleChangeUserMenu(option)}
                  key={option.id}
                  isLastElement={_.isEqual(index, _.size(USER_MENU) - 1)}
                >
                  <MenuModalContents>
                    <MaterialIcons
                      size={ICON_SIZES.menuModalOptionIcon}
                      name={option.icon}
                      color={
                        tinycolor(customTheme.primaryBackgroundColor).isDark()
                          ? COLORS.LIGHT_TEXT_COLOR
                          : COLORS.DARK_TEXT_COLOR
                      }
                    />
                    <MenuText customTheme={customTheme}>
                      {_.capitalize(intl[option.label])}
                    </MenuText>
                  </MenuModalContents>
                </MenuModalButton>
              ))}
            </MenuWrapper>
          </Container>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(UserMenu);
