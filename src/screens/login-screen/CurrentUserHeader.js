import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import { connect } from 'react-redux';
import Header from 'components/common/Header';
import { getCustomTheme, getIntl } from 'state/rootReducer';

const CurrentMenuDisplay = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CurrentMenuText = styled.Text`
  margin-left: 5px;
  color: ${props => props.customTheme.primaryColor};
`;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const Touchable = styled.TouchableOpacity``;

class CurrentUserHeader extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    currentMenuOption: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    toggleCurrentUserMenu: PropTypes.func.isRequired,
    handleNavigateToEditProfile: PropTypes.func.isRequired,
  };

  render() {
    const { currentMenuOption, customTheme, intl } = this.props;
    return (
      <Header>
        <Touchable onPress={this.props.handleNavigateToEditProfile}>
          <MenuIconContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.accountEdit}
              color={customTheme.primaryColor}
            />
          </MenuIconContainer>
        </Touchable>
        <Touchable onPress={this.props.toggleCurrentUserMenu}>
          <CurrentMenuDisplay>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={currentMenuOption.icon}
              color={customTheme.primaryColor}
            />
            <CurrentMenuText customTheme={customTheme}>
              {_.capitalize(intl[currentMenuOption.label])}
            </CurrentMenuText>
          </CurrentMenuDisplay>
        </Touchable>
        <Touchable onPress={this.props.toggleCurrentUserMenu}>
          <MenuIconContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.menuVertical}
              color={customTheme.primaryColor}
            />
          </MenuIconContainer>
        </Touchable>
      </Header>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(CurrentUserHeader);
