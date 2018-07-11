import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import BackButton from 'components/common/BackButton';
import Header from 'components/common/Header';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  sendMessage,
  fetchCurrentMessages,
  blockUser,
  unblockUser,
  hideDisplayedUserMessage,
} from 'state/actions/firebaseActions';
import _ from 'lodash';
import {
  getUserMessages,
  getAuthUsername,
  getBlockedUsers,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import firebase from 'firebase';
import { getUsersMessagesRef } from 'util/firebaseUtils';
import { COLORS, FONT_AWESOME_ICONS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import UserMessageMenuModal from 'components/messages/UserMessageMenuModal';
import UserMessage from 'components/messages/UserMessage';
import TitleText from 'components/common/TitleText';
import PrimaryText from 'components/common/text/PrimaryText';
import tinycolor from 'tinycolor2';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View`
  background: ${props => props.customTheme.primaryBackgroundColor};
  flex: 1;
`;

const InputContainer = styled.View`
  height: 50px;
  background: ${props => props.customTheme.primaryBackgroundColor};
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-top-width: 1px;
  border-top-color: ${props => props.customTheme.primaryBorderColor};
`;

const EmptyView = styled.View`
  height: 300px;
  width: ${Math.floor(deviceWidth / 2)};
`;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const Touchable = styled.TouchableOpacity``;

const BlockedText = styled(PrimaryText)`
  padding: 10px;
  color: ${props => props.customTheme.tertiaryColor};
`;

const mapStateToProps = (state, ownProps) => {
  const { username } = ownProps.navigation.state.params;
  return {
    blockedUsers: getBlockedUsers(state),
    authUsername: getAuthUsername(state),
    messages: getUserMessages(state, username),
    customTheme: getCustomTheme(state),
    intl: getIntl(state),
  };
};

const mapDispatchToProps = dispatch => ({
  sendMessage: (username, text, successCallback) =>
    dispatch(sendMessage.action({ username, text, successCallback })),
  fetchCurrentMessages: (username, successCallback) =>
    dispatch(fetchCurrentMessages.action({ username, successCallback })),
  fetchCurrentMessagesSuccess: (username, messages) =>
    dispatch(fetchCurrentMessages.success({ username, messages })),
  blockUser: username => dispatch(blockUser.action({ username })),
  unblockUser: username => dispatch(unblockUser.action({ username })),
  hideDisplayedUserMessage: username => dispatch(hideDisplayedUserMessage.action({ username })),
});

class UserMessageScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    sendMessage: PropTypes.func.isRequired,
    authUsername: PropTypes.string.isRequired,
    fetchCurrentMessages: PropTypes.func.isRequired,
    fetchCurrentMessagesSuccess: PropTypes.func.isRequired,
    messages: PropTypes.shape(),
    blockedUsers: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    unblockUser: PropTypes.func.isRequired,
    blockUser: PropTypes.func.isRequired,
    hideDisplayedUserMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    messages: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      displayMenu: false,
    };

    this.handleNavigateBack = this.handleNavigateBack.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.successSendMessage = this.successSendMessage.bind(this);
    this.handleRefreshMessages = this.handleRefreshMessages.bind(this);
    this.handleListenToNewMessages = this.handleListenToNewMessages.bind(this);
    this.handleScrollToBottom = this.handleScrollToBottom.bind(this);
    this.handleBlockUser = this.handleBlockUser.bind(this);
    this.handleNavigateToUser = this.handleNavigateToUser.bind(this);
    this.handleHideUserMessage = this.handleHideUserMessage.bind(this);
  }

  componentWillMount() {
    const { authUsername } = this.props;
    const { username } = this.props.navigation.state.params;
    firebase
      .database()
      .ref(getUsersMessagesRef(authUsername, username))
      .on('value', this.handleListenToNewMessages);
  }

  componentDidMount() {
    const { username } = this.props.navigation.state.params;
    this.props.fetchCurrentMessages(username);
  }

  componentWillUnmount() {
    const { authUsername } = this.props;
    const { username } = this.props.navigation.state.params;
    firebase
      .database()
      .ref(getUsersMessagesRef(authUsername, username))
      .off('value', this.handleListenToNewMessages);
  }

  onChangeText(text) {
    this.setState({
      text,
    });
  }

  successSendMessage() {
    this.setState({
      text: '',
    });
  }

  handleScrollToBottom() {
    try {
      if (this.scrollView) {
        _.attempt(this.scrollView.scrollToEnd, { animated: false });
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleListenToNewMessages(snapshot) {
    const messages = snapshot.val() || {};
    const { username } = this.props.navigation.state.params;
    this.props.fetchCurrentMessagesSuccess(username, messages);
  }

  handleSetLoading = loading => () =>
    this.setState({
      loading,
    });

  handleSendMessage() {
    const { blockedUsers } = this.props;
    const { username } = this.props.navigation.state.params;
    const isBlocked = _.get(blockedUsers, username, false);

    if (_.isEmpty(this.state.text) || isBlocked) return;
    this.props.sendMessage(username, this.state.text, this.successSendMessage);
  }

  handleSetDisplayMenu = displayMenu => () => this.setState({ displayMenu });

  handleHideUserMessage() {
    const { username } = this.props.navigation.state.params;
    this.setState({
      displayMenu: false,
    });
    this.props.hideDisplayedUserMessage(username);
    this.props.navigation.goBack();
  }

  handleBlockUser() {
    const { blockedUsers } = this.props;
    const { username } = this.props.navigation.state.params;
    const isBlocked = _.get(blockedUsers, username, false);

    if (isBlocked) {
      this.props.unblockUser(username);
    } else {
      this.props.blockUser(username);
    }
    this.setState({
      displayMenu: false,
    });
  }

  handleNavigateToUser() {
    const { username } = this.props.navigation.state.params;
    this.setState({
      displayMenu: false,
    });
    this.props.navigation.push(navigationConstants.USER, { username });
  }

  handleNavigateBack() {
    this.props.navigation.goBack();
  }

  handleRefreshMessages() {
    const { username } = this.props.navigation.state.params;
    this.setState({ loading: true });
    this.props.fetchCurrentMessages(username, this.handleSetLoading(false));
  }

  renderMessages() {
    return _.map(this.props.messages, (message, index) => (
      <UserMessage
        key={`${message.username}-${message.timestamp}-${index}`}
        username={message.username}
        timestamp={message.timestamp}
        text={message.text}
      />
    ));
  }

  render() {
    const { blockedUsers, customTheme, intl } = this.props;
    const { username } = this.props.navigation.state.params;
    const { text, loading, displayMenu } = this.state;
    const isBlocked = _.get(blockedUsers, username, false);
    const color = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;

    return (
      <Container customTheme={customTheme}>
        <Header>
          <BackButton navigateBack={this.handleNavigateBack} />
          <TitleText>{username}</TitleText>
          <Touchable onPress={this.handleSetDisplayMenu(true)}>
            <MenuIconContainer>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.menuVertical}
                color={customTheme.primaryColor}
              />
            </MenuIconContainer>
          </Touchable>
        </Header>
        <ScrollView
          ref={scrollView => {
            this.scrollView = scrollView;
          }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={this.handleRefreshMessages}
              tintColor={customTheme.primaryColor}
              colors={[customTheme.primaryColor]}
            />
          }
          onContentSizeChange={this.handleScrollToBottom}
        >
          {isBlocked ? (
            <BlockedText customTheme={customTheme}>{intl.message_content_is_hidden}</BlockedText>
          ) : (
            this.renderMessages()
          )}
          <EmptyView />
        </ScrollView>
        <KeyboardAvoidingView behavior="position">
          <InputContainer customTheme={customTheme}>
            <TextInput
              style={{ height: 40, width: '90%', color }}
              placeholderTextColor={customTheme.secondaryColor}
              onChangeText={this.onChangeText}
              value={isBlocked ? intl.user_is_blocked : text}
              multiline
              editable={!isBlocked}
            />
            <TouchableOpacity onPress={this.handleSendMessage}>
              <FontAwesome
                name={FONT_AWESOME_ICONS.sendMessage}
                size={ICON_SIZES.actionIcon}
                color={customTheme.primaryColor}
              />
            </TouchableOpacity>
          </InputContainer>
        </KeyboardAvoidingView>
        <UserMessageMenuModal
          visible={displayMenu}
          hideMenu={this.handleSetDisplayMenu(false)}
          handleNavigateToUser={this.handleNavigateToUser}
          handleBlockUser={this.handleBlockUser}
          isBlocked={isBlocked}
          handleHideUserMessage={this.handleHideUserMessage}
          customTheme={customTheme}
          intl={intl}
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMessageScreen);
