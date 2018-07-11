import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Expo from 'expo';
import { connect } from 'react-redux';
import PrimaryText from 'components/common/text/PrimaryText';
import { getCustomTheme, getIntl } from 'state/rootReducer';

const Container = styled.View`
  padding: 20px;
`;

const Text = styled(PrimaryText)`
  color: ${props => props.customTheme.tertiaryColor};
`;

const LinkText = styled(PrimaryText)`
  color: ${props => props.customTheme.primaryColor};
`;

const Touchable = styled.TouchableWithoutFeedback``;

class DisclaimerText extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

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
    const { customTheme, intl } = this.props;
    return (
      <Container>
        <Text customTheme={customTheme}>{intl.disclaimer_text}</Text>
        <Touchable onPress={this.handlePrivacyLink}>
          <LinkText customTheme={customTheme}>{intl.terms_and_conditions}</LinkText>
        </Touchable>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(DisclaimerText);
