import React from 'react';
import PropTypes from 'prop-types';
import { getAvatarImageUrl } from 'util/busyImageUtils';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const defaultImage =
  'https://res.cloudinary.com/hpiynhbhq/image/upload/v1506948447/p72avlprkfariyti7q2l.png';

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

class Avatar extends React.PureComponent {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
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
    const { size, customTheme } = this.props;
    const { imageUrl } = this.state;
    const avatarStyle = {
      height: size,
      width: size,
      borderRadius: size / 2,
      borderWidth: 1,
      borderColor: customTheme.primaryBorderColor,
    };

    return <Image onError={this.handleOnError} source={{ uri: imageUrl }} style={avatarStyle} />;
  }
}

export default connect(mapStateToProps)(Avatar);
