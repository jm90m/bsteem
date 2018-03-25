import React, { Component } from 'react';
import { COLORS } from 'constants/styles';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { encryptionSecretKey } from 'constants/config';
import CryptoJS from 'crypto-js';
import _ from 'lodash';
import styled from 'styled-components/native';
import Avatar from 'components/common/Avatar';
import moment from 'moment-timezone';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View`
  flex-direction: row;
  padding: 10px;
`;

const Username = styled.Text`
  margin: 0 5px;
  color: ${COLORS.PRIMARY_COLOR};
  font-size: 18px;
  font-weight: bold;
`;

const Text = styled.Text`
  margin: 0 5px;
  padding-right: 5px;
  flex-wrap: wrap;
  width: ${deviceWidth - 55};
`;

const TimeStampContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TimeStamp = styled.Text`
  margin-left: 5px;
  color: ${COLORS.TERTIARY_COLOR};
  font-size: 12px;
`;

const TextContainer = styled.View``;

class UserMessage extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    text: PropTypes.string,
    timestamp: PropTypes.number,
  };

  static defaultProps = {
    text: '',
    timestamp: 0,
  };

  getDecryptedText() {
    try {
      const { text } = this.props;
      const bytes = CryptoJS.AES.decrypt(text, encryptionSecretKey);

      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  render() {
    const { username, timestamp } = this.props;
    const text = this.getDecryptedText();

    return (
      <Container>
        <Avatar username={username} size={30} />
        <TextContainer>
          <TimeStampContainer>
            <Username>{`@${username}`}</Username>
            <TimeStamp>{moment(timestamp).format('MM/DD hh:mm A')}</TimeStamp>
          </TimeStampContainer>
          <Text>{text}</Text>
        </TextContainer>
      </Container>
    );
  }
}

export default UserMessage;
