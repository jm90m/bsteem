import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import { getValidImageUrl } from 'util/imageUtils';

const { width } = Dimensions.get('screen');

const StyledImage = styled.Image`
  min-height: 200px;
  max-height: 400px;
`;

class PreviewImage extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    images: [],
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
    if (noImage) return null;
    return (
      <StyledImage
        style={{ height: null, width }}
        source={{ uri: imageUrl }}
        resizeMode={Image.resizeMode.cover}
        onError={this.handlePreviewImageError}
      />
    );
  }
}

export default PreviewImage;
