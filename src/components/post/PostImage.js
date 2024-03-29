import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image } from 'react-native';
import _ from 'lodash';
import { getValidImageUrl } from 'util/imageUtils';
import SmallLoading from '../common/SmallLoading';

const { width: deviceWidth } = Dimensions.get('screen');

class PostImage extends Component {
  static propTypes = {
    images: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    height: PropTypes.number,
    width: PropTypes.number,
    widthOffset: PropTypes.number,
    onError: PropTypes.func,
  };

  static defaultProps = {
    images: [],
    height: 300,
    width: deviceWidth,
    onError: undefined,
    widthOffset: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      imageUrl: Array.isArray(props.images) ? _.head(props.images) : props.images,
      noImage: false,
      width: props.width,
      height: props.height,
      loading: false,
    };

    this.handlePreviewImageError = this.handlePreviewImageError.bind(this);
  }

  componentWillMount() {
    const { imageUrl } = this.state;
    this.setState({ loading: true });
    Image.getSize(
      imageUrl,
      (width, height) => {
        this.setState({
          width,
          height,
          loading: false,
        });
      },
      error => {
        this.setState({
          noImage: true,
          loading: false,
        });
        console.log(`Couldn't get the image size: ${error.message}`);
      },
    );
  }

  handlePreviewImageError() {
    const { images } = this.props;
    if (Array.isArray(images)) {
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
    } else {
      this.setState({
        noImage: true,
      });
    }
  }

  render() {
    const { imageUrl, noImage, height, width: imgWidth, loading } = this.state;
    const { onError, height: maxHeight, widthOffset } = this.props;
    const onErrorHandler = onError || this.handlePreviewImageError;
    let imageHeight = height;
    let imageWidth = imgWidth;

    if (noImage) return null;

    if (height > maxHeight) {
      imageHeight = maxHeight;
    }

    if (imgWidth > deviceWidth) {
      imageWidth = deviceWidth;
    }

    if (loading) {
      return <SmallLoading style={{ padding: 10 }} />;
    }

    return (
      <Image
        style={{
          width: imageWidth - widthOffset,
          height: imageHeight,
        }}
        source={{ uri: imageUrl }}
        resizeMode={Image.resizeMode.cover}
        onError={onErrorHandler}
      />
    );
  }
}

export default PostImage;
