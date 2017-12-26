import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getHasNetworkConnection } from 'state/rootReducer';
import styled from 'styled-components/native';

const Container = styled.View`
  position: absolute;
  left: 0;
  justify-content: center;
  align-items: center;
  background-color: red;
  height: 100px;
  border-bottom-width: 1px;
  padding: 10px;
  border-bottom-color: red;
  width: 100%;
`;

const Text = styled.Text`
  color: white;
`;

const mapStateToProps = state => ({
  networkConnection: getHasNetworkConnection(state),
});

@connect(mapStateToProps)
class NetConnectionBanner extends Component {
  static propTypes = {
    networkConnection: PropTypes.bool.isRequired,
  };

  render() {
    const { networkConnection } = this.props;
    if (!networkConnection) {
      return (
        <Container>
          <Text>
            No internet connection found, please connect to internet and restart the app
          </Text>
        </Container>
      );
    }
  }
}

export default NetConnectionBanner;
