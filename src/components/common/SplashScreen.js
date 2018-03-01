import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AppLoading } from 'expo';
import { getIsAppLoading } from 'state/rootReducer';
import * as appActions from 'state/actions/appActions';

const mapStateToProps = state => ({
  appLoading: getIsAppLoading(state),
});

const mapDispatchToProps = dispatch => ({
  appOnboarding: () => dispatch(appActions.appOnboarding.action()),
});

class SplashScreen extends Component {
  static propTypes = {
    appLoading: PropTypes.bool.isRequired,
    appOnboarding: PropTypes.func.isRequired,
    assetsAreLoaded: PropTypes.bool,
  };

  static defaultProps = {
    assetsAreLoaded: false,
  };

  componentDidMount() {
    this.props.appOnboarding();
  }
  render() {
    const { appLoading, assetsAreLoaded } = this.props;
    const displaySplashScreen = !assetsAreLoaded || appLoading;
    return displaySplashScreen && <AppLoading />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
