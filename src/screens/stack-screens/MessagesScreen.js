import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import BackButton from 'components/common/BackButton';
import Header from 'components/common/Header';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getMessagesSearchUserResults,
  getLoadingFetchMessages,
  getLoadingMessagesSearchUserResults,
  getDisplayedMessages,
  getBlockedUsers,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import { SearchBar } from 'react-native-elements';
import * as navigationConstants from 'constants/navigation';
import * as firebaseActions from 'state/actions/firebaseActions';
import UserMessagePreview from 'components/messages/UserMessagePreview';
import TitleText from 'components/common/TitleText';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import tinycolor from 'tinycolor2';

const ScrollView = styled.ScrollView`
  height: 100%;
`;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  blockedUsers: getBlockedUsers(state),
  displayedMessages: getDisplayedMessages(state),
  messagesSearchUserResults: getMessagesSearchUserResults(state),
  loadingFetchMessages: getLoadingFetchMessages(state),
  loadingMessagesSearchUserResults: getLoadingMessagesSearchUserResults(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  searchUserMessages: search => dispatch(firebaseActions.searchUserMessages.action(search)),
  fetchBlockedUsers: () => dispatch(firebaseActions.fetchBlockedUsers.action()),
});

class MessagesScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLabel: 'Messages',
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    messagesSearchUserResults: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    searchUserMessages: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    displayedMessages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    blockedUsers: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    fetchBlockedUsers: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentSearchValue: '',
    };

    this.handleSearchOnChangeText = this.handleSearchOnChangeText.bind(this);
    this.handleNavigateBack = this.handleNavigateBack.bind(this);
  }

  componentDidMount() {
    this.props.fetchBlockedUsers();
  }

  handleSearchOnChangeText(value) {
    this.setState(
      {
        currentSearchValue: value,
      },
      () => this.props.searchUserMessages(value),
    );
  }

  navigateToUserMessage = username => () => {
    this.props.navigation.navigate(navigationConstants.USER_MESSAGE, {
      username,
    });
  };

  handleNavigateBack() {
    this.props.navigation.goBack();
  }

  renderSearchResults() {
    const { messagesSearchUserResults, displayedMessages, blockedUsers } = this.props;
    const { currentSearchValue } = this.state;

    if (!_.isEmpty(currentSearchValue)) {
      const filteredDisplayedMessages = _.filter(displayedMessages, message =>
        _.includes(message.toUser, currentSearchValue),
      );
      const joinedResults = _.unionBy(
        filteredDisplayedMessages,
        messagesSearchUserResults,
        'toUser',
      );

      return _.map(joinedResults, message => {
        const isBlocked = _.get(blockedUsers, message.toUser, false);

        return (
          <UserMessagePreview
            key={message.toUser}
            username={message.toUser}
            navigateToUserMessage={this.navigateToUserMessage(message.toUser)}
            previewText={isBlocked ? '' : message.text}
          />
        );
      });
    }

    return _.map(displayedMessages, (message, index) => {
      const isBlocked = _.get(blockedUsers, message.toUser, false);

      if (isBlocked) return null;

      return (
        <UserMessagePreview
          key={`${message.toUser}-${index}`}
          username={message.toUser}
          navigateToUserMessage={this.navigateToUserMessage(message.toUser)}
          previewText={message.text}
        />
      );
    });
  }

  render() {
    const { customTheme, intl } = this.props;
    const { currentSearchValue } = this.state;
    const color = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;

    return (
      <StyledViewPrimaryBackground>
        <Header>
          <BackButton navigateBack={this.handleNavigateBack} />
          <TitleText>{intl.messages}</TitleText>
          <MenuIconContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.menuVertical}
              color="transparent"
            />
          </MenuIconContainer>
        </Header>
        <SearchBar
          lightTheme
          onChangeText={this.handleSearchOnChangeText}
          placeholder=""
          value={currentSearchValue}
          containerStyle={{
            backgroundColor: customTheme.primaryBackgroundColor,
            borderTopWidth: 0,
            borderBottomColor: customTheme.primaryBorderColor,
          }}
          inputStyle={{ backgroundColor: customTheme.primaryBackgroundColor, color }}
          showLoadingIcon={false}
          autoCorrect={false}
          autoCapitalize="none"
          clearIcon
        />
        <ScrollView>{this.renderSearchResults()}</ScrollView>
      </StyledViewPrimaryBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesScreen);
