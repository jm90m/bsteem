import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { encryptionSecretKey } from 'constants/config';
import CryptoJS from 'crypto-js';
import styled from 'styled-components/native';
import Avatar from 'components/common/Avatar';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import PrimaryText from 'components/common/text/PrimaryText';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View`
  flex-direction: row;
  padding: 10px;
`;

const Username = styled(PrimaryText)`
  margin: 0 5px;
  color: ${props => props.customTheme.primaryColor};
  font-size: 18px;
`;

const Text = styled(StyledTextByBackground)`
  margin: 0 5px;
  padding-right: 5px;
  flex-wrap: wrap;
  width: ${deviceWidth - 55};
`;

const TimeStampContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TimeStamp = styled(PrimaryText)`
  margin-left: 5px;
  color: ${props => props.customTheme.tertiaryColor};
  font-size: 12px;
`;

const TextContainer = styled.View``;

class UserMessage extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    customTheme: PropTypes.shape().isRequired,
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
    const { username, timestamp, customTheme } = this.props;
    const text = this.getDecryptedText();

    return (
      <Container>
        <Avatar username={username} size={30} />
        <TextContainer>
          <TimeStampContainer>
            <Username customTheme={customTheme}>{`@${username}`}</Username>
            <TimeStamp customTheme={customTheme}>
              {moment(timestamp).format('MM/DD hh:mm A')}
            </TimeStamp>
          </TimeStampContainer>
          <Text>{text}</Text>
        </TextContainer>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(UserMessage);
