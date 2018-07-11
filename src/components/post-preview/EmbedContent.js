import React, { Component } from 'react';
import { getCustomTheme } from 'state/rootReducer';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MATERIAL_ICONS } from 'constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import {
  WebView,
  Dimensions,
  View,
  Image,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet,
} from 'react-native';
import LargeLoading from 'components/common/LargeLoading';

const { width: deviceWidth } = Dimensions.get('screen');
const isAndroid = Platform !== 'ios';

const styles = StyleSheet.create({
  imagePreview: {
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 340,
    backgroundColor: 'transparent',
  },
});

class EmbedContent extends Component {
  static propTypes = {
    embedContent: PropTypes.shape({
      provider_name: PropTypes.string,
      thumbnail: PropTypes.string,
      embed: PropTypes.string,
    }).isRequired,
    customTheme: PropTypes.shape().isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
  };

  static defaultProps = {
    height: 400,
    width: deviceWidth,
  };

  constructor(props) {
    super(props);

    this.state = {
      hideIframe: true,
    };

    this.handleThumbClick = this.handleThumbClick.bind(this);
  }

  handleThumbClick() {
    this.setState({ hideIframe: false });
  }

  renderLoading() {
    return <LargeLoading />;
  }

  renderIframe() {
    const { height, width, embedContent } = this.props;
    const html = `<html><body style="padding: 0; margin: 0;">${embedContent.embed}</body></html>`;
    let webViewSource = { html };

    if (embedContent.provider_name === 'DTube') {
      webViewSource = { uri: embedContent.source };
    }

    return (
      <View style={{ width, height }}>
        <WebView
          source={webViewSource}
          style={{
            width,
            height,
            flex: 1,
          }}
          mediaPlaybackRequiresUserAction
          renderLoading={this.renderLoading}
          scrollEnabled={false}
          allowsInlineMediaPlayback
          scalesPageToFit={isAndroid}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }

  render() {
    const { embedContent, width, customTheme } = this.props;
    const { hideIframe } = this.state;

    if (hideIframe && embedContent.provider_name === 'DTube') {
      const imagePreviewStyles = [
        styles.imagePreview,
        {
          width,
        },
      ];
      const imageStyles = {
        width,
        height: 340,
      };
      return (
        <TouchableWithoutFeedback onPress={this.handleThumbClick}>
          <View style={imageStyles}>
            <Image source={{ uri: embedContent.thumbnail }} style={imageStyles} />
            <View style={imagePreviewStyles}>
              <MaterialIcons
                name={MATERIAL_ICONS.playCirlceOutline}
                size={240}
                color={customTheme.primaryColor}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }

    if (embedContent.embed) {
      return this.renderIframe();
    }
    return <View />;
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(EmbedContent);
