import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AppLoading } from 'expo';

class SplashScreen extends Component {
  static propTypes = {
    assetsAreLoaded: PropTypes.bool.isRequired,
  };

  render() {
    const { assetsAreLoaded } = this.props;
    const displaySplashScreen = !assetsAreLoaded;
    return displaySplashScreen && <AppLoading />;
  }
}

export default SplashScreen;
