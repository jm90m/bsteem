import React, { Component } from 'react';
import { TouchableWithoutFeedback, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, FONT_AWESOME_ICONS, ICON_SIZES } from 'constants/styles';
import CryptoJS from 'crypto-js';
import { encryptionSecretKey } from 'constants/config';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import Avatar from 'components/common/Avatar';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View`
  flex-direction: row;
  padding: 10px;
`;

const PreviewTextContainer = styled.View``;

const Username = styled.Text`
  margin: 0 5px;
  color: ${COLORS.PRIMARY_COLOR};
  font-size: 18px;
  font-weight: bold;
`;

const PreviewText = styled.Text`
  margin: 0 5px;
  color: ${COLORS.TERTIARY_COLOR};
  width: ${deviceWidth - 55};
`;

const SendMessageContainer = styled.View`
  margin-left: auto;
  padding: 10px;
`;

class UserMessagePreview extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    navigateToUserMessage: PropTypes.func.isRequired,
    previewText: PropTypes.string,
  };

  static defaultProps = {
    previewText: '',
  };

  getDecryptedText() {
    try {
      const { previewText } = this.props;
      const bytes = CryptoJS.AES.decrypt(previewText, encryptionSecretKey);
      const plainText = bytes.toString(CryptoJS.enc.Utf8);
      return _.replace(
        _.trim(
          _.truncate(plainText, {
            length: 15,
          }),
        ),
        /(?:\r\n|\r|\n)/g,
        '',
      );
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  render() {
    const { username } = this.props;
    const previewText = this.getDecryptedText();

    return (
      <TouchableWithoutFeedback onPress={this.props.navigateToUserMessage}>
        <Container>
          <Avatar username={username} size={40} />
          <PreviewTextContainer>
            <Username>{`@${username}`}</Username>
            <PreviewText>{previewText}</PreviewText>
          </PreviewTextContainer>
          <SendMessageContainer>
            <FontAwesome
              name={FONT_AWESOME_ICONS.sendMessage}
              size={ICON_SIZES.actionIcon}
              color={COLORS.PRIMARY_COLOR}
            />
          </SendMessageContainer>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default UserMessagePreview;
