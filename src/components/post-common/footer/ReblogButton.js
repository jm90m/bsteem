import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SmallLoading from 'components/common/SmallLoading';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from '../../../constants/styles';
import Touchable from '../../common/Touchable';
import {
  getCustomTheme,
  getAuthUsername,
  getCurrentUserRebloggedList,
} from '../../../state/rootReducer';

class ReblogButton extends React.PureComponent {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    authUsername: PropTypes.string.isRequired,
    rebloggedList: PropTypes.arrayOf(PropTypes.string).isRequired,
    loadingReblog: PropTypes.bool,
    author: PropTypes.string,
    parentAuthor: PropTypes.string,
    postId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onPressReblog: PropTypes.func,
  };

  static defaultProps = {
    loadingReblog: false,
    author: '',
    parentAuthor: '',
    postId: 0,
    onPressReblog: () => {},
  };

  render() {
    const {
      authUsername,
      author,
      onPressReblog,
      loadingReblog,
      rebloggedList,
      parentAuthor,
      customTheme,
      postId,
    } = this.props;
    const ownPost = authUsername === author;
    const showReblogLink = !ownPost && parentAuthor === '';
    const isReblogged = _.includes(rebloggedList, `${postId}`);

    if (loadingReblog) {
      return <SmallLoading />;
    }

    if (isReblogged) {
      return (
        <View>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.reblog}
            size={ICON_SIZES.footerActionIcon}
            color={customTheme.primaryColor}
          />
        </View>
      );
    }

    if (showReblogLink) {
      return (
        <Touchable onPress={onPressReblog}>
          <View>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.reblog}
              size={ICON_SIZES.footerActionIcon}
              color={customTheme.tertiaryColor}
            />
          </View>
        </Touchable>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  rebloggedList: getCurrentUserRebloggedList(state),
  authUsername: getAuthUsername(state),
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(ReblogButton);
