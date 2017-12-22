import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getAuthUsername } from 'state/rootReducer';
import CurrentUserFeed from './CurrentUserFeed';

const Container = styled.View`
  flex: 1;
`;

const mapStateToProps = state => ({
  username: getAuthUsername(state),
});

@connect(mapStateToProps)
class CurrentUserScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
  };

  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <CurrentUserFeed navigation={navigation} />
      </Container>
    );
  }
}

export default CurrentUserScreen;
