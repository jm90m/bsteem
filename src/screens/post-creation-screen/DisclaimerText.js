import React, { Component } from 'react';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import i18n from 'i18n/i18n';
import Expo from 'expo';

const Container = styled.View`
  padding: 20px;
`;

const Text = styled.Text`
  color: ${COLORS.TERTIARY_COLOR};
`;

const LinkText = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
`;

const Touchable = styled.TouchableWithoutFeedback``;

class DisclaimerText extends Component {
  constructor(props) {
    super(props);

    this.handlePrivacyLink = this.handlePrivacyLink.bind(this);
  }

  handlePrivacyLink() {
    const url = 'https://steemit.com/tos.html';
    Expo.WebBrowser.openBrowserAsync(url).catch(error => {
      console.log('invalid url', error, url);
    });
  }

  render() {
    return (
      <Container>
        <Text>{i18n.editor.disclaimerText}</Text>
        <Touchable onPress={this.handlePrivacyLink}>
          <LinkText>{i18n.editor.tos}</LinkText>
        </Touchable>
      </Container>
    );
  }
}

export default DisclaimerText;
