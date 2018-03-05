import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getAvatarImageUrl } from 'util/busyImageUtils';
import { COLORS } from 'constants/styles';
import { Image as ExpoImage } from 'react-native-expo-image-cache';

const defaultImage =
  'https://res.cloudinary.com/hpiynhbhq/image/upload/v1506948447/p72avlprkfariyti7q2l.png';

class Avatar extends Component {
  static propTypes = {
    username: PropTypes.string,
    size: PropTypes.number,
  };

  static defaultProps = {
    username: undefined,
    size: 34,
  };

  constructor(props) {
    super(props);

    this.state = {
      imageUrl: getAvatarImageUrl(props.username, props.size),
    };

    this.handleOnError = this.handleOnError.bind(this);
    this.setImageUrl = this.setImageUrl.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.username !== nextProps.username) {
      this.setImageUrl(nextProps.username, nextProps.size);
    }
  }
  setImageUrl(username, size) {
    this.setState({
      imageUrl: getAvatarImageUrl(username, size),
    });
  }

  handleOnError() {
    this.setState({
      imageUrl: defaultImage,
    });
  }

  render() {
    const { size } = this.props;
    const { imageUrl } = this.state;
    const avatarStyle = {
      height: size,
      width: size,
      borderRadius: size / 2,
      borderWidth: 1,
      borderColor: COLORS.BORDER_COLOR,
    };

    return (
      <ExpoImage size={size} onError={this.handleOnError} uri={imageUrl} style={avatarStyle} />
    );
  }
}

export default Avatar;
