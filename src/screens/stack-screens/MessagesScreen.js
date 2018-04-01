import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import i18n from 'i18n/i18n';
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
} from 'state/rootReducer';
import { SearchBar } from 'react-native-elements';
import * as navigationConstants from 'constants/navigation';
import * as firebaseActions from 'state/actions/firebaseActions';
import UserMessagePreview from 'components/messages/UserMessagePreview';

const Container = styled.View`
  background-color: ${COLORS.PRIMARY_BACKGROUND_COLOR};
`;

const TitleText = styled.Text`
  font-weight: bold;
  color: ${COLORS.PRIMARY_COLOR};
`;

const ScrollView = styled.ScrollView`
  height: 100%;
`;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const mapStateToProps = state => ({
  blockedUsers: getBlockedUsers(state),
  displayedMessages: getDisplayedMessages(state),
  messagesSearchUserResults: getMessagesSearchUserResults(state),
  loadingFetchMessages: getLoadingFetchMessages(state),
  loadingMessagesSearchUserResults: getLoadingMessagesSearchUserResults(state),
});

const mapDispatchToProps = dispatch => ({
  searchUserMessages: search => dispatch(firebaseActions.searchUserMessages.action(search)),
  fetchBlockedUsers: () => dispatch(firebaseActions.fetchBlockedUsers.action()),
});

class MessagesScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  static propTypes = {
    messagesSearchUserResults: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    searchUserMessages: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    displayedMessages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    blockedUsers: PropTypes.shape().isRequired,
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
    const { currentSearchValue } = this.state;

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.handleNavigateBack} />
          <TitleText>{i18n.titles.messages}</TitleText>
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
            backgroundColor: COLORS.PRIMARY_BACKGROUND_COLOR,
            borderTopWidth: 0,
            borderBottomColor: COLORS.PRIMARY_BORDER_COLOR,
          }}
          inputStyle={{ backgroundColor: COLORS.PRIMARY_BACKGROUND_COLOR }}
          showLoadingIcon={false}
          autoCorrect={false}
          autoCapitalize="none"
          clearIcon
        />
        <ScrollView>{this.renderSearchResults()}</ScrollView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesScreen);
