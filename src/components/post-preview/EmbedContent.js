import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView, Dimensions, View, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MATERIAL_ICONS, COLORS } from 'constants/styles';
import styled from 'styled-components/native';

const { width: deviceWidth } = Dimensions.get('screen');

const IconContainer = styled.View`
  position: absolute;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

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
    embedContent: {},
    height: 400,
    width: deviceWidth - 20,
  };

  constructor(props) {
    super(props);

    this.state = {
      showIframe: false,
    };

    this.handleThumbClick = this.handleThumbClick.bind(this);
  }

  handleThumbClick() {
    this.setState({ showIframe: true });
  }

  renderThumbFirst() {
    const { height, width, embedContent } = this.props;
    return (
      <TouchableOpacity onPress={this.handleThumbClick}>
        <Image
          source={{ uri: embedContent.thumbnail }}
          style={{ width, height }}
          resizeMode={Image.resizeMode.contain}
        />
        <IconContainer>
          <MaterialIcons name={MATERIAL_ICONS.playCircle} size={200} color={COLORS.RED.VALENCIA} />
        </IconContainer>
      </TouchableOpacity>
    );
  }

  renderIframe() {
    const { height, width, embedContent } = this.props;

    return (
      <WebView
        source={{ html: embedContent.embed }}
        style={{ height, width }}
        width={width}
        height={height}
      />
    );
  }
  render() {
    const { embedContent, inPost } = this.props;
    const shouldRenderThumb = inPost ? false : !this.state.showIframe;

    if (
      (embedContent.provider_name === 'YouTube' || embedContent.provider_name === 'DTube') &&
      shouldRenderThumb
    ) {
      return this.renderThumbFirst(embedContent.thumbnail);
    } else if (embedContent.embed) {
      console.log('RENDER_IFRAME');
      return this.renderIframe();
    }
    return <View />;
  }
}

export default EmbedContent;

// renderWithIframe = embed => (
//   // eslint-disable-next-line react/no-danger
//   <div dangerouslySetInnerHTML={{ __html: embed }} />
// );
//
// renderThumbFirst(thumb) {
//   return (
//     <div role="presentation" className="PostFeedEmbed" onClick={this.handleThumbClick}>
//       <div className="PostFeedEmbed__playButton">
//         <i className="iconfont icon-group icon-playon_fill" />
//       </div>
//       <img alt="thumbnail" className="PostFeedEmbed__preview" src={thumb} />
//     </div>
//   );
// }
//
