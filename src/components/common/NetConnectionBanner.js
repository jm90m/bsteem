import React, { Component } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getHasNetworkConnection } from 'state/rootReducer';
import styled from 'styled-components/native';

const Container = styled.View`
  position: absolute;
  left: 0;
  top: 50px;
  justify-content: center;
  align-items: center;
  background-color: red;
  height: 100px;
  border-width: 1px;
  border-radius: 4px;
  border-color: red;
  padding: 10px;
  width: 100%;
`;

const WarningText = styled.Text`
  color: white;
`;

const Touchable = styled.TouchableOpacity`
  align-self: flex-end;
`;

const mapStateToProps = state => ({
  networkConnection: getHasNetworkConnection(state),
});

@connect(mapStateToProps)
class NetConnectionBanner extends Component {
  static propTypes = {
    networkConnection: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      closeBanner: false,
    };

    this.handleCloseBanner = this.handleCloseBanner.bind(this);
  }

  handleCloseBanner() {
    this.setState({
      closeBanner: true,
    });
  }

  render() {
    const { networkConnection } = this.props;
    const { closeBanner } = this.state;

    if (closeBanner) return null;

    if (!networkConnection) {
      return (
        <Container>
          <Touchable onPress={this.handleCloseBanner}>
            <MaterialIcons name="close" size={20} />
          </Touchable>
          <WarningText>
            No internet connection found, please connect to internet and restart the app
          </WarningText>
        </Container>
      );
    }

    return null;
  }
}

export default NetConnectionBanner;
