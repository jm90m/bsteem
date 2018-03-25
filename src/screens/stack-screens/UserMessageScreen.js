import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import i18n from 'i18n/i18n';
import { connect } from 'react-redux';
import BackButton from 'components/common/BackButton';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import Header from 'components/common/Header';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, FONT_AWESOME_ICONS, ICON_SIZES } from '../../constants/styles';

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
`;

class UserMessageScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.handleNavigateBack = this.handleNavigateBack.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  handleSendMessage() {}

  handleNavigateBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { username } = this.props.navigation.state.params;
    const behavior = Platform.OS === 'ios' ? 'position' : null;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.handleNavigateBack} />
          <TitleText>{username}</TitleText>
          <HeaderEmptyView />
        </Header>
        <ScrollViewContent />
        <KeyboardAvoidingView behavior={behavior}>
          <InputContainer>
            <TextInput style={{ height: 40, width: '90%' }} />
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

export default UserMessageScreen;
