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
    height: 400,
    width: deviceWidth,
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
        style={{
          width,
          height,
        }}
        scalesPageToFit={false}
      />
    );
  }
  render() {
    const { embedContent, inPost } = this.props;

    if (embedContent.embed) {
      return this.renderIframe();
    }
    return <View />;
  }
}

export default EmbedContent;
