import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Modal, WebView, Dimensions } from 'react-native';
import _ from 'lodash';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import SafeAreaView from 'components/common/SafeAreaView';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import * as navigationConstants from 'constants/navigation';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES, MATERIAL_ICONS } from 'constants/styles';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import TitleText from 'components/common/TitleText';
import Touchable from 'components/common/Touchable';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
`;

const RightMenuIconContainer = styled.View`
  padding: 5px;
  flex-direction: row;
`;

const StyledScrollView = styled.ScrollView``;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

class AppsScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      displayAppModal: false,
      app: null,
    };

    this.navigateBack = this.navigateBack.bind(this);
    this.handleHideAppModal = this.handleHideAppModal.bind(this);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  handleHideAppModal() {
    this.setState({
      displayAppModal: false,
    });
  }

  handleNavigateToUser = username => () => {
    this.props.navigation.push(navigationConstants.USER, { username });
  };

  handleViewApp = app => () => {
    this.setState({
      displayAppModal: true,
      app,
    });
  };

  renderApps() {
    const apps = ['pacman', 'flappy bird'];

    return _.map(apps, (app, index) => (
      <Touchable onPress={this.handleViewApp(app)} key={index}>
        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'black' }}>
          <TitleText>{app}</TitleText>
        </View>
      </Touchable>
    ));
  }

  renderAppModal() {
    const webViewSource = { uri: 'https://secure-dawn-51500.herokuapp.com/' };
    const patchPostMessageFunction = function() {
      var originalPostMessage = window.postMessage;

      var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
      };

      patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
      };

      window.postMessage = patchedPostMessage;
    };
    const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

    return (
      <View
        style={{
          flex: 1,
          width: deviceWidth,
          height: 500,
        }}
      >
        <Touchable onPress={this.handleHideAppModal}>
          <View style={{ height: 50 }}>
            <Text>Move Back</Text>
          </View>
        </Touchable>
        <WebView
          injectedJavaScript={patchPostMessageJsCode}
          source={webViewSource}
          style={{
            width: deviceWidth,
            height: 500,
            flex: 1,
          }}
          mediaPlaybackRequiresUserAction
          scrollEnabled={false}
          allowsInlineMediaPlayback
          automaticallyAdjustContentInsets={false}
          onMessage={event => {
            console.log(event.nativeEvent.data);
          }}
        />
      </View>
    );
  }

  render() {
    const { customTheme, intl } = this.props;
    const { displayAppModal } = this.state;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleContainer>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_ICONS.moneyOff}
              color={customTheme.primaryColor}
            />
            <TitleText style={{ marginLeft: 3 }}>{intl.platform_apps}</TitleText>
          </TitleContainer>
          <RightMenuIconContainer>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.menuVertical}
              size={ICON_SIZES.menuIcon}
              color="transparent"
            />
          </RightMenuIconContainer>
        </Header>
        <StyledScrollView>{this.renderApps()}</StyledScrollView>
        {displayAppModal && (
          <Modal
            animationType="slide"
            visible={displayAppModal}
            onRequestClose={this.handleHideAppModal}
          >
            <SafeAreaView>{this.renderAppModal()}</SafeAreaView>
          </Modal>
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps)(AppsScreen);
