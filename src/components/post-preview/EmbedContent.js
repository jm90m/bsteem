import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView, Dimensions, View } from 'react-native';
import LargeLoading from 'components/common/LargeLoading';

const { width: deviceWidth } = Dimensions.get('screen');

class EmbedContent extends Component {
  static propTypes = {
    embedContent: PropTypes.shape({
      provider_name: PropTypes.string,
      thumbnail: PropTypes.string,
      embed: PropTypes.string,
    }).isRequired,
    inPost: PropTypes.bool,
    height: PropTypes.number,
    width: PropTypes.number,
  };

  static defaultProps = {
    height: 400,
    width: deviceWidth,
  };

  renderLoading() {
    return <LargeLoading />;
  }

  renderIframe() {
    const { height, width, embedContent } = this.props;
    return (
      <WebView
        source={{ html: embedContent.embed }}
        style={{
          width,
          height,
        }}
        mediaPlaybackRequiresUserAction
        renderLoading={this.renderLoading}
        scrollEnabled={false}
      />
    );
  }
  render() {
    const { embedContent } = this.props;

    if (embedContent.embed) {
      return this.renderIframe();
    }
    return <View />;
  }
}

export default EmbedContent;
