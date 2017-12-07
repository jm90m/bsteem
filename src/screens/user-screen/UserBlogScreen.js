import React, { Component } from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';

const Container = styled.View``;

class UserBlogScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => <MaterialIcons name={'home'} size={20} color={tintColor} />,
  };

  render() {
    return <Container />;
  }
}

export default UserBlogScreen;
