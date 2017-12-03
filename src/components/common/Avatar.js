import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { getAvatarImageUrl } from 'util/busyImageUtils';

const AvatarImage = styled.Image`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  border-radius: 10px;
`;

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

  state = {
    imageUrl: defaultImage,
  };

  componentDidMount() {
    const { username, size } = this.props;

    this.setImageUrl(username, size);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.username !== nextProps.username) {
      this.setImageUrl(nextProps.username, nextProps.size);
    }
  }

  handleOnError = () => {
    this.setState({
      imageUrl: defaultImage,
    });
  };

  setImageUrl = (username, size) => {
    this.setState({
      imageUrl: getAvatarImageUrl(username, size),
    });
  };

  render() {
    const { size } = this.props;
    const { imageUrl } = this.state;
    return <AvatarImage size={size} onError={this.handleOnError} source={{ uri: imageUrl }} />;
  }
}

export default Avatar;
