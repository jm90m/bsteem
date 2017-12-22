import React from 'react';
import { View } from 'react-native';
import sc2 from 'api/sc2';
import { Provider } from 'react-redux';
import { Constants, AppLoading, Asset } from 'expo';
import configureStore from 'state/configureStore';

import AppNavigation from 'screens/navigation/AppNavigation';

const store = configureStore();

export default class App extends React.Component {
  state = {
    assetsAreLoaded: false,
  };

  componentWillMount() {
    this.loadAssetsAsync();
  }

  componentDidMount() {
    sc2.init({
      app: 'busy-mobile',
      callbackURL: `${Constants.linkingUri}/redirect`,
      scope: [],
    });
  }

  async loadAssetsAsync() {
    try {
      await Promise.all([Asset.loadAsync([require('./src/images/steem.png')])]);
    } catch (e) {
      console.warn(
        'There was an error caching assets network timeout, so we skipped caching. Reload the app to try again.',
      );

      console.log(e);
    } finally {
      this.setState({ assetsAreLoaded: true });
    }
  }

  render() {
    if (!this.state.assetsAreLoaded) {
      return <AppLoading />;
    }

    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <AppNavigation />
        </View>
      </Provider>
    );
  }
}
