import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import BackButton from 'components/common/BackButton';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import Header from 'components/common/Header';
import i18n from 'i18n/i18n';
import { connect } from 'react-redux';
import { COLORS } from '../../constants/styles';

const TitleText = styled.Text`
  font-weight: bold;
  color: ${COLORS.PRIMARY_COLOR};
`;

const Container = styled.View``;

class UserMessageScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.handleNavigateBack = this.handleNavigateBack.bind(this);
  }

  handleNavigateBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { username } = this.props.navigation.state.params;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.handleNavigateBack} />
          <TitleText>{username}</TitleText>
          <HeaderEmptyView />
        </Header>
      </Container>
    );
  }
}

export default UserMessageScreen;
