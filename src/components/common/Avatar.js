import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { getAvatarImageUrl } from 'util/busyImageUtils';
import { COLORS } from 'constants/styles';

const AvatarImage = styled.Image`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  border-radius: ${props => props.size / 2}px;
  border-width: 1px;
  border-color: ${COLORS.BORDER_COLOR};
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

  constructor(props) {
    super(props);

    this.state = {
      imageUrl: defaultImage,
    };

    this.handleOnError = this.handleOnError.bind(this);
    this.setImageUrl = this.setImageUrl.bind(this);
  }

  componentDidMount() {
    const { username, size } = this.props;

    this.setImageUrl(username, size);
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
    return <AvatarImage size={size} onError={this.handleOnError} source={{ uri: imageUrl }} />;
  }
}

export default Avatar;
