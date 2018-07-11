import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import Touchable from 'components/common/Touchable';
import _ from 'lodash';
import * as navigationConstants from 'constants/navigation';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { jsonStringify } from '../../util/bsteemUtils';

class TouchableWithCommentsNavigation extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    children: PropTypes.node,
    postDetails: PropTypes.shape({
      author: PropTypes.string,
      category: PropTypes.string,
      permlink: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  };

  static defaultProps = {
    children: null,
    postDetails: {
      author: '',
      category: '',
      permlink: '',
      id: 0,
    },
  };

  constructor(props) {
    super(props);

    this.handleCommentsNavigation = this.handleCommentsNavigation.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const diffCustomTheme =
      jsonStringify(this.props.customTheme) !== jsonStringify(nextProps.customTheme);
    const diffPostDetails =
      jsonStringify(this.props.postDetails) !== jsonStringify(nextProps.postDetails);
    return diffCustomTheme || diffPostDetails;
  }

  handleCommentsNavigation() {
    const { postDetails } = this.props;
    const { category, author, permlink, id: postId } = postDetails;
    this.props.navigation.push(navigationConstants.COMMENTS, {
      author,
      category,
      permlink,
      postId,
      postData: postDetails,
    });
  }

  render() {
    return (
      <Touchable onPress={this.handleCommentsNavigation}>
        <View>{this.props.children}</View>
      </Touchable>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(withNavigation(TouchableWithCommentsNavigation));
