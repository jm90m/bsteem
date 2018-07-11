import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import Touchable from 'components/common/Touchable';
import { jsonStringify } from 'util/bsteemUtils';
import { connect } from 'react-redux';
import * as navigationConstants from 'constants/navigation';
import { getCustomTheme } from '../../state/rootReducer';

class TouchableWithVotesNavigation extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    children: PropTypes.node,
    postDetails: PropTypes.shape(),
  };

  static defaultProps = {
    children: null,
    postDetails: {},
  };

  constructor(props) {
    super(props);

    this.handleNavigateToVotes = this.handleNavigateToVotes.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const diffCustomTheme =
      jsonStringify(this.props.customTheme) !== jsonStringify(nextProps.customTheme);
    const diffPostDetails =
      jsonStringify(this.props.postDetails) !== jsonStringify(nextProps.postDetails);
    return diffPostDetails || diffCustomTheme;
  }

  handleNavigateToVotes() {
    const { postDetails } = this.props;
    this.props.navigation.push(navigationConstants.VOTES, {
      postData: postDetails,
    });
  }

  render() {
    return (
      <Touchable onPress={this.handleNavigateToVotes}>
        <View>{this.props.children}</View>
      </Touchable>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(withNavigation(TouchableWithVotesNavigation));
