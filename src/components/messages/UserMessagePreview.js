import React, { Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, FONT_AWESOME_ICONS, ICON_SIZES } from 'constants/styles';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import Avatar from 'components/common/Avatar';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
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
`;

const SendMessageContainer = styled.View`
  margin-left: auto;
  padding: 10px;
`;

class UserMessagePreview extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    navigateToUserMessage: PropTypes.func.isRequired,
    navigateToUser: PropTypes.func.isRequired,
    previewText: PropTypes.string,
  };

  static defaultProps = {
    previewText: '',
  };

  render() {
    const { username, previewText } = this.props;
    const truncatedPreviewText = _.truncate(previewText, {
      length: 50,
    });

    return (
      <Container>
        <TouchableWithoutFeedback onPress={this.props.navigateToUser}>
          <Avatar username={username} size={40} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.props.navigateToUserMessage}>
          <PreviewTextContainer>
            <Username>{`@${username}`}</Username>
            <PreviewText>{truncatedPreviewText}</PreviewText>
          </PreviewTextContainer>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.props.navigateToUserMessage}>
          <SendMessageContainer>
            <FontAwesome
              name={FONT_AWESOME_ICONS.sendMessage}
              size={ICON_SIZES.actionIcon}
              color={COLORS.PRIMARY_COLOR}
            />
          </SendMessageContainer>
        </TouchableWithoutFeedback>
      </Container>
    );
  }
}

export default UserMessagePreview;
