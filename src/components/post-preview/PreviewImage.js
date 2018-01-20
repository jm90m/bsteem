import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import { getValidImageUrl } from 'util/imageUtils';

const { width } = Dimensions.get('screen');

const StyledImage = styled.Image``;

class PreviewImage extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.string),
    height: PropTypes.number,
    width: PropTypes.number,
    onError: PropTypes.func,
  };

  static defaultProps = {
    images: [],
    height: 300,
    width,
    onError: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      imageUrl: _.head(props.images),
      noImage: false,
    };

    this.handlePreviewImageError = this.handlePreviewImageError.bind(this);
  }

  handlePreviewImageError() {
    const { images } = this.props;
    const newImageUrl = getValidImageUrl(images);
    if (!_.isNull(newImageUrl)) {
      this.setState({
        imageUrl: newImageUrl,
      });
    } else {
      this.setState({
        noImage: true,
      });
    }
  }

  render() {
    const { imageUrl, noImage } = this.state;
    const { height, width: imageWidth, onError } = this.props;
    const onErrorHandler = onError || this.handlePreviewImageError;
    if (noImage) return null;
    return (
      <StyledImage
        style={{ width: imageWidth, height }}
        source={{ uri: imageUrl }}
        resizeMode={Image.resizeMode.contain}
        onError={onErrorHandler}
      />
    );
  }
}

export default PreviewImage;
