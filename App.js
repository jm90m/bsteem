import React from 'react';
import { View } from 'react-native';
import sc2 from 'api/sc2';
import { Provider } from 'react-redux';
import { Constants, Asset } from 'expo';
import configureStore from 'state/configureStore';
import AppNavigation from 'screens/navigation/AppNavigation';
import SteemConnectErrorModal from 'components/common/steem-connect/SteemConnectErrorModalContainer';
import NotifyModal from 'components/common/notify/NotifyModal';
import SplashScreen from 'components/common/SplashScreen';
import CryptoPriceModal from 'components/common/crypto-price-modal/CryptoPriceModal';
import MessagesModal from 'components/messages/MessagesModal';

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
      app: 'bsteem',
      callbackURL: `${Constants.linkingUri}/redirect`,
    });
  }

  async loadAssetsAsync() {
    try {
      await Promise.all([
        Asset.loadAsync([
          require('./src/images/steem.png'),
          require('./assets/bsteem-name-logo.png'),
        ]),
      ]);
    } catch (e) {
      console.warn(
        'There was an error caching assets network timeout, so we skipped caching. Reload the app to try again.',
      );
    } finally {
      this.setState({ assetsAreLoaded: true });
    }
  }

  render() {
    const { assetsAreLoaded } = this.state;
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <AppNavigation />
          <SteemConnectErrorModal />
          <NotifyModal />
          <CryptoPriceModal />
          <MessagesModal />
          <SplashScreen assetsAreLoaded={assetsAreLoaded} />
        </View>
      </Provider>
    );
  }
}
