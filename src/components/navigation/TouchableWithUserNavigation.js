import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import Touchable from 'components/common/Touchable';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { jsonStringify } from 'util/bsteemUtils';
import * as navigationConstants from '../../constants/navigation';

class TouchableWithUserNavigation extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    children: PropTypes.node,
    username: PropTypes.string,
  };

  static defaultProps = {
    username: '',
    children: null,
  };

  constructor(props) {
    super(props);

    this.handleUserNavigation = this.handleUserNavigation.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const diffCustomTheme =
      jsonStringify(this.props.customTheme) !== jsonStringify(nextProps.customTheme);
    return this.props.username !== nextProps.username || diffCustomTheme;
  }

  handleUserNavigation() {
    const { navigation, username } = this.props;
    navigation.push(navigationConstants.USER, { username });
  }

  render() {
    return (
      <Touchable onPress={this.handleUserNavigation}>
        <View>{this.props.children}</View>
      </Touchable>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(withNavigation(TouchableWithUserNavigation));
