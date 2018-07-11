import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TouchableWithCommentsNavigation from 'components/navigation/TouchableWithCommentsNavigation';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import _ from 'lodash';
import commonStyles from 'styles/common';
import { getCustomTheme } from 'state/rootReducer';
import { connect } from 'react-redux';
import { jsonStringify } from '../../../util/bsteemUtils';

class CommentsButton extends React.Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    postDetails: PropTypes.shape(),
  };

  static defaultProps = {
    postDetails: {
      author: '',
      category: '',
      permlink: '',
      id: 0,
      children: [],
    },
  };

  shouldComponentUpdate(nextProps) {
    const diffPostDetails = !_.isEqual(
      jsonStringify(this.props.postDetails),
      jsonStringify(nextProps.postDetails),
    );
    const diffCustomTheme = !_.isEqual(this.props.customTheme, nextProps.customTheme);

    return diffPostDetails || diffCustomTheme;
  }

  render() {
    const { customTheme, postDetails } = this.props;
    const { children: commentsCount } = postDetails;

    return (
      <TouchableWithCommentsNavigation postDetails={postDetails}>
        <View style={commonStyles.rowAlignedCenterContainer}>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.comment}
            size={ICON_SIZES.footerActionIcon}
            color={customTheme.tertiaryColor}
          />
          <Text
            style={[
              commonStyles.footerValue,
              { color: customTheme.tertiaryColor, marginBottom: 3 },
            ]}
          >
            {commentsCount}
          </Text>
        </View>
      </TouchableWithCommentsNavigation>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(CommentsButton);
