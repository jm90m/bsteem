import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { getReputation } from 'util/steemitFormatters';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import ReputationScore from 'components/post/ReputationScore';
import Avatar from 'components/common/Avatar';
import { getCustomTheme } from 'state/rootReducer';
import { connect } from 'react-redux';
import TimeAgo from 'components/common/TimeAgo';
import Touchable from 'components/common/Touchable';
import commonStyles from 'styles/common';
import Author from './Author';
import TagContainer from './TagContainer';
import RebloggedText from './RebloggedText';
import PostedFrom from './PostedFrom';

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 5,
  },
  postMenu: { paddingLeft: 10, paddingRight: 10, paddingBottom: 10 },
  headerContents: {
    paddingHorizontal: 12,
  },
  postMenuContainer: {
    marginLeft: 'auto',
  },
});

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

class Header extends React.Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    postData: PropTypes.shape(),
    currentUsername: PropTypes.string,
    displayMenu: PropTypes.func,
    hideMenuButton: PropTypes.bool,
  };

  static defaultProps = {
    hideMenuButton: false,
    currentUsername: '',
    postData: {},
    displayMenu: () => {},
  };

  render() {
    const { postData, displayMenu, hideMenuButton, customTheme, currentUsername } = this.props;
    const {
      category,
      author,
      author_reputation,
      created,
      title,
      id,
      permlink,
      json_metadata,
      beneficiaries,
    } = postData;
    const authorReputation = getReputation(author_reputation);
    const firstRebloggedBy = _.get(postData, 'first_reblogged_by');
    const firstRebloggedOn = _.get(postData, 'first_reblogged_on');

    return (
      <View style={styles.container}>
        <RebloggedText firstRebloggedBy={firstRebloggedBy} firstRebloggedOn={firstRebloggedOn} />
        <View style={commonStyles.rowContainer}>
          <Avatar username={author} size={40} />
          <View style={styles.headerContents}>
            <View>
              <View style={commonStyles.rowContainer}>
                <Author author={author} currentUsername={currentUsername} />
                <ReputationScore reputation={authorReputation} />
              </View>
              <View style={commonStyles.rowContainer}>
                <TimeAgo created={created} />
                <PostedFrom
                  displaySeperator
                  jsonMetadata={json_metadata}
                  beneficiaries={beneficiaries}
                />
              </View>
            </View>
          </View>
          {!hideMenuButton && (
            <View style={styles.postMenuContainer}>
              <Touchable onPress={displayMenu} style={styles.postMenu}>
                <MaterialCommunityIcons
                  name={MATERIAL_COMMUNITY_ICONS.menuHorizontal}
                  size={ICON_SIZES.menuIcon}
                  color={customTheme.tertiaryColor}
                />
              </Touchable>
            </View>
          )}
        </View>
        <TagContainer
          tag={category}
          title={title}
          permlink={permlink}
          author={author}
          id={id}
          created={created}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps)(Header);
