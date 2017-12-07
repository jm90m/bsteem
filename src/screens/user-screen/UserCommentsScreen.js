import React, { Component } from 'react';
import styled from 'styled-components/native';

const Container = styled.View``;

class UserCommentsScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };
  render() {
    return <Container />;
  }
}

export default UserCommentsScreen;
