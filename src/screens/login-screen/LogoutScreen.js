import React, { Component } from 'react';
import styled from 'styled-components/native';

const StyledWebView = styled.WebView`
  flex: 1;
  margin-top: 20px;
`;

class LogoutScreen extends Component {
  render() {
    return <StyledWebView source={{ uri: 'https://v2.steemconnect.com/dashboard' }} />;
  }
}

export default LogoutScreen;
