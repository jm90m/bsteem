import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import Touchable from 'components/common/Touchable';
import * as navigationConstants from 'constants/navigation';

class TouchableWithFeedNavigation extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    children: PropTypes.node,
    tag: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    tag: 'bsteem',
  };

  constructor(props) {
    super(props);

    this.handleFeedNavigation = this.handleFeedNavigation.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.tag !== nextProps.tag;
  }

  handleFeedNavigation() {
    const { navigation, tag } = this.props;

    navigation.push(navigationConstants.FEED, { tag });
  }

  render() {
    return (
      <Touchable onPress={this.handleFeedNavigation}>
        <View>{this.props.children}</View>
      </Touchable>
    );
  }
}

export default withNavigation(TouchableWithFeedNavigation);
