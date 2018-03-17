import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getAuthUsername } from 'state/rootReducer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from 'components/common/Header';
import { ICON_SIZES, COLORS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import { displayPriceModal } from 'state/actions/appActions';
import * as navigationConstants from 'constants/navigation';
import CurrentUserFeed from './CurrentUserFeed';
import CurrentUserBSteemFeed from './CurrentUserBSteemFeed';

const Container = styled.View`
  flex: 1;
`;

const Touchable = styled.TouchableOpacity``;

const HeaderText = styled.Text`
  color: ${props => (props.selected ? COLORS.PRIMARY_COLOR : COLORS.SECONDARY_COLOR)};
  align-self: center;
  font-weight: bold;
`;

const MiddleMenu = styled.View`
  flex-direction: row;
`;

const MiddleMenuContent = styled.View`
  border-bottom-width: 2;
  border-bottom-color: ${props => (props.selected ? COLORS.PRIMARY_COLOR : 'transparent')};
  padding: 10px 20px;
`;

const mapStateToProps = state => ({
  username: getAuthUsername(state),
});

const mapDispatchToProps = dispatch => ({
  displayPriceModal: symbols => dispatch(displayPriceModal(symbols)),
});

class CurrentUserScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    displayPriceModal: PropTypes.func.isRequired,
  };

  static MENU = {
    home: 'Home',
    bSteem: 'bSteem',
  };
  constructor(props) {
    super(props);

    this.state = {
      selectedMenu: CurrentUserScreen.MENU.home,
    };

    this.setSelectedMenu = this.setSelectedMenu.bind(this);
    this.handleNavigateToSavedTags = this.handleNavigateToSavedTags.bind(this);
    this.handleDisplayPriceModal = this.handleDisplayPriceModal.bind(this);
  }

  setSelectedMenu(selectedMenu) {
    this.setState({
      selectedMenu,
    });
  }

  handleDisplayPriceModal() {
    this.props.displayPriceModal(['STEEM', 'SBD']);
  }

  handleNavigateToSavedTags() {
    this.props.navigation.navigate(navigationConstants.SAVED_CONTENT);
  }

  render() {
    const { navigation } = this.props;
    const { selectedMenu } = this.state;
    const selectedHome = CurrentUserScreen.MENU.home === selectedMenu;

    return (
      <Container>
        <Header>
          <Touchable onPress={this.handleDisplayPriceModal}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.lineChart}
              size={ICON_SIZES.menuIcon}
              color={COLORS.PRIMARY_COLOR}
              style={{ padding: 5 }}
            />
          </Touchable>
          <MiddleMenu>
            <Touchable onPress={() => this.setSelectedMenu(CurrentUserScreen.MENU.home)}>
              <MiddleMenuContent selected={selectedHome}>
                <HeaderText selected={selectedHome}>{CurrentUserScreen.MENU.home}</HeaderText>
              </MiddleMenuContent>
            </Touchable>
            <Touchable onPress={() => this.setSelectedMenu(CurrentUserScreen.MENU.bSteem)}>
              <MiddleMenuContent style={{ marginLeft: 15 }} selected={!selectedHome}>
                <HeaderText selected={!selectedHome}>{CurrentUserScreen.MENU.bSteem}</HeaderText>
              </MiddleMenuContent>
            </Touchable>
          </MiddleMenu>
          <Touchable onPress={this.handleNavigateToSavedTags}>
            <MaterialCommunityIcons
              name="star"
              size={ICON_SIZES.menuIcon}
              style={{ padding: 5 }}
              color={COLORS.PRIMARY_COLOR}
            />
          </Touchable>
        </Header>
        {selectedHome ? (
          <CurrentUserFeed navigation={navigation} />
        ) : (
          <CurrentUserBSteemFeed navigation={navigation} />
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUserScreen);
