import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import tinycolor from 'tinycolor2';
import { MaterialIcons } from '@expo/vector-icons';
import { CURRENT_USER_MENU } from 'constants/userMenu';
import { ICON_SIZES, COLORS } from 'constants/styles';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';
import MenuText from 'components/common/menu/MenuText';
import MenuModalContents from 'components/common/menu/MenuModalContents';

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
  align-items: center;
`;

const CurrentUserMenu = ({ customTheme, intl, hideMenu, handleChangeUserMenu }) => (
  <TouchableWithoutFeedback onPress={hideMenu}>
    <Container>
      <MenuWrapper>
        {_.map(CURRENT_USER_MENU, (option, index) => (
          <MenuModalButton
            onPress={() => handleChangeUserMenu(option)}
            key={option.id}
            isLastElement={_.isEqual(index, _.size(CURRENT_USER_MENU) - 1)}
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
              <MenuText>{_.capitalize(intl[option.label])}</MenuText>
            </MenuModalContents>
          </MenuModalButton>
        ))}
      </MenuWrapper>
    </Container>
  </TouchableWithoutFeedback>
);

CurrentUserMenu.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  hideMenu: PropTypes.func.isRequired,
  handleChangeUserMenu: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(CurrentUserMenu);
