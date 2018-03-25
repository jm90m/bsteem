import React, { Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from 'constants/styles';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import Avatar from 'components/common/Avatar';
import moment from 'moment-timezone';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const PreviewTextContainer = styled.View``;

const Username = styled.Text`
  margin: 0 5px;
  color: ${COLORS.PRIMARY_COLOR};
  font-size: 18px;
  font-weight: bold;
`;

const Text = styled.Text`
  margin: 0 5px;
`;

const SendMessageContainer = styled.View`
  margin-left: auto;
  padding: 10px;
`;

const TimeStampContainer = styled.View`
  flex-direction: row;
`;

const TimeStamp = styled.Text`
  color: ${COLOR.TERTIARY_COLOR};
`;

class UserMessagePreview extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    navigateToUserMessage: PropTypes.func.isRequired,
    navigateToUser: PropTypes.func.isRequired,
    text: PropTypes.string,
    timestamp: PropTypes.number,
  };

  static defaultProps = {
    text: '',
  };

  render() {
    const { username, text, timestamp } = this.props;

    return (
      <Container>
        <TouchableWithoutFeedback onPress={this.props.navigateToUser}>
          <Avatar username={username} size={30} />
        </TouchableWithoutFeedback>
        <TimeStampContainer>
          <Username>{`@${username}`}</Username>
          <TimeStamp>{}</TimeStamp>
        </TimeStampContainer>
        <Text>{text}</Text>
      </Container>
    );
  }
}

export default UserMessagePreview;
