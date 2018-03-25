import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import BackButton from 'components/common/BackButton';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import Header from 'components/common/Header';
import { FontAwesome } from '@expo/vector-icons';
import { sendMessage, fetchCurrentMessages } from 'state/actions/firebaseActions';
import _ from 'lodash';
import { getUserMessages } from 'state/rootReducer';
import { COLORS, FONT_AWESOME_ICONS, ICON_SIZES } from 'constants/styles';
import UserMessage from 'components/messages/UserMessage';

const TitleText = styled.Text`
  font-weight: bold;
  color: ${COLORS.PRIMARY_COLOR};
`;

const Container = styled.View`
  background: ${COLORS.PRIMARY_BACKGROUND_COLOR};
  flex: 1;
`;

const ScrollViewContent = styled.ScrollView``;

const InputContainer = styled.View`
  height: 50px;
  background: ${COLORS.PRIMARY_BACKGROUND_COLOR};
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-top-width: 1px;
  border-top-color: ${COLORS.PRIMARY_BORDER_COLOR};
`;

const mapStateToProps = (state, ownProps) => {
  const { username } = ownProps.navigation.state.params;
  return {
    messages: getUserMessages(state, username),
  };
};

const mapDispatchToProps = dispatch => ({
  sendMessage: (username, text, successCallback) =>
    dispatch(sendMessage.action({ username, text, successCallback })),
  fetchCurrentMessages: (username, successCallback) =>
    dispatch(fetchCurrentMessages.action({ username, successCallback })),
});

class UserMessageScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    sendMessage: PropTypes.func.isRequired,
    messages: PropTypes.shape(),
    fetchCurrentMessages: PropTypes.func.isRequired,
  };

  static defaultProps = {
    messages: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
    };

    this.handleNavigateBack = this.handleNavigateBack.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.successSendMessage = this.successSendMessage.bind(this);
    this.handleRefreshMessages = this.handleRefreshMessages.bind(this);
  }

  componentDidMount() {
    const { username } = this.props.navigation.state.params;
    this.props.fetchCurrentMessages(username);
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

  handleSetLoading = loading => () =>
    this.setState({
      loading,
    });

  handleSendMessage() {
    const { username } = this.props.navigation.state.params;

    this.props.sendMessage(username, this.state.text, this.successSendMessage);
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
    const { username } = this.props.navigation.state.params;
    const { text, loading } = this.state;
    const behavior = Platform.OS === 'ios' ? 'position' : null;

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.handleNavigateBack} />
          <TitleText>{username}</TitleText>
          <HeaderEmptyView />
        </Header>
        <ScrollViewContent
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={this.handleRefreshMessages}
              tintColor={COLORS.PRIMARY_COLOR}
              colors={[COLORS.PRIMARY_COLOR]}
            />
          }
        >
          {this.renderMessages()}
        </ScrollViewContent>
        <KeyboardAvoidingView behavior={behavior}>
          <InputContainer>
            <TextInput
              style={{ height: 40, width: '90%' }}
              placeholderTextColor={COLORS.SECONDARY_COLOR}
              onChangeText={this.onChangeText}
              value={text}
            />
            <TouchableOpacity onPress={this.handleSendMessage}>
              <FontAwesome
                name={FONT_AWESOME_ICONS.sendMessage}
                size={ICON_SIZES.actionIcon}
                color={COLORS.PRIMARY_COLOR}
              />
            </TouchableOpacity>
          </InputContainer>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMessageScreen);
