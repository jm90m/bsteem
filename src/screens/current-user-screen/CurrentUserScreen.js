import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from 'components/common/Header';
import { ICON_SIZES, COLORS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import { getAuthUsername } from 'state/rootReducer';
import firebase from 'firebase';
import { fetchDisplayedMessages } from 'state/actions/firebaseActions';
import { getUserAllPrivateMessagesRef } from 'util/firebaseUtils';
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
  authUsername: getAuthUsername(state),
});

const mapDispatchToProps = dispatch => ({
  fetchDisplayedMessagesSuccess: messages => dispatch(fetchDisplayedMessages.success(messages)),
});

class CurrentUserScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    authUsername: PropTypes.string.isRequired,
    fetchDisplayedMessagesSuccess: PropTypes.func.isRequired,
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

    this.handleNavigateToSavedTags = this.handleNavigateToSavedTags.bind(this);
    this.handleNavigateToMessages = this.handleNavigateToMessages.bind(this);
    this.handleSuccessFetchDisplayedMessages = this.handleSuccessFetchDisplayedMessages.bind(this);
  }

  componentWillMount() {
    const { authUsername } = this.props;
    firebase
      .database()
      .ref(getUserAllPrivateMessagesRef(authUsername))
      .on('value', this.handleSuccessFetchDisplayedMessages);
  }

  setSelectedMenu = selectedMenu => () =>
    this.setState({
      selectedMenu,
    });

  handleSuccessFetchDisplayedMessages(snapshot) {
    const messages = snapshot.val() || {};
    this.props.fetchDisplayedMessagesSuccess(messages);
  }

  handleNavigateToMessages() {
    this.props.navigation.navigate(navigationConstants.MESSAGES);
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
          <Touchable onPress={this.handleNavigateToMessages}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.messageText}
              size={ICON_SIZES.menuIcon}
              color={COLORS.PRIMARY_COLOR}
              style={{ padding: 5 }}
            />
          </Touchable>
          <MiddleMenu>
            <Touchable onPress={this.setSelectedMenu(CurrentUserScreen.MENU.home)}>
              <MiddleMenuContent selected={selectedHome}>
                <HeaderText selected={selectedHome}>{CurrentUserScreen.MENU.home}</HeaderText>
              </MiddleMenuContent>
            </Touchable>
            <Touchable onPress={this.setSelectedMenu(CurrentUserScreen.MENU.bSteem)}>
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
        <CurrentUserFeed navigation={navigation} hideFeed={!selectedHome} />
        <CurrentUserBSteemFeed navigation={navigation} hideFeed={selectedHome} />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUserScreen);
