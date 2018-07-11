import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, Share, Clipboard, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bsteemShareText, getBusyUrl, getSteemitURL } from 'util/bsteemUtils';
import { withNavigation } from 'react-navigation';
import commonStyles from 'styles/common';
import ReportPostMenuButton from './ReportPostMenuButton';
import { MATERIAL_COMMUNITY_ICONS, MATERIAL_ICONS } from '../../constants/styles';
import MenuModalButton from '../common/menu/MenuModalButton';
import MenuWrapper from '../common/menu/MenuWrapper';
import MenuText from '../common/menu/MenuText';
import MenuModalContents from '../common/menu/MenuModalContents';
import MenuIcon from '../common/menu/MenuIcon';
import SavePostMenuButton from './SavePostMenuButton';
import SavePostOfflineMenuButton from './SavePostOfflineMenuButton';
import { getAuthUsername, getCustomTheme, getIntl } from '../../state/rootReducer';
import * as navigationConstants from '../../constants/navigation';

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  authUsername: getAuthUsername(state),
  intl: getIntl(state),
});

class PostMenu extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    authUsername: PropTypes.string.isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    hideMenu: PropTypes.func,
    postData: PropTypes.shape({
      author: PropTypes.string,
      title: PropTypes.string,
      permlink: PropTypes.string,
      id: PropTypes.number,
    }),
    displayPhotoBrowserMenu: PropTypes.bool,
    handleDisplayPhotoBrowser: PropTypes.func,
  };

  static defaultProps = {
    postData: {},
    displayPhotoBrowserMenu: false,
    hideMenu: () => {},
    handleDisplayPhotoBrowser: () => {},
  };

  constructor(props) {
    super(props);

    this.handleShare = this.handleShare.bind(this);
    this.handleSetBusyURLClipboard = this.handleSetBusyURLClipboard.bind(this);
    this.handleSetSteemitRLClipboard = this.handleSetSteemitRLClipboard.bind(this);
    this.handleNavigateToComments = this.handleNavigateToComments.bind(this);
    this.handleEditPost = this.handleEditPost.bind(this);
    this.handleBeneficiariesNavigation = this.handleBeneficiariesNavigation.bind(this);
  }

  handleShare() {
    this.props.hideMenu();
    const { postData } = this.props;
    const title = _.get(postData, 'title', '');
    const message = bsteemShareText;
    const author = _.get(postData, 'author', '');
    const permlink = _.get(postData, 'permlink', '');
    const url = getBusyUrl(author, permlink);
    const content = {
      message,
      title,
      url,
    };
    Share.share(content);
  }

  handleSetSteemitRLClipboard() {
    const { postData } = this.props;
    const author = _.get(postData, 'author', '');
    const permlink = _.get(postData, 'permlink', '');
    const url = getSteemitURL(author, permlink);
    Clipboard.setString(url);
    this.props.hideMenu();
  }

  handleSetBusyURLClipboard() {
    const { postData } = this.props;
    const author = _.get(postData, 'author', '');
    const permlink = _.get(postData, 'permlink', '');
    const url = getBusyUrl(author, permlink);
    Clipboard.setString(url);
    this.props.hideMenu();
  }

  handleNavigateToComments() {
    this.props.hideMenu();
    const { postData } = this.props;
    const { category, author, permlink, id } = postData;
    this.props.navigation.push(navigationConstants.COMMENTS, {
      author,
      category,
      permlink,
      postId: id,
      postData,
    });
  }

  handleEditPost() {
    const { postData } = this.props;
    this.props.hideMenu();
    this.props.navigation.navigate(navigationConstants.EDIT_POST, {
      postData,
    });
  }

  handleBeneficiariesNavigation() {
    const { postData } = this.props;
    const { beneficiaries } = postData;

    this.props.navigation.push(navigationConstants.POST_BENEFICIARIES, { beneficiaries });
    this.props.hideMenu();
  }

  render() {
    const {
      hideMenu,
      postData,
      authUsername,
      displayPhotoBrowserMenu,
      handleDisplayPhotoBrowser,
      customTheme,
      intl,
    } = this.props;
    const {
      title,
      permlink,
      author,
      id,
      created,
      cashout_time: cashoutTime,
      beneficiaries,
    } = postData;
    const displayReportButton = authUsername !== author;
    const displayEditPostButton = authUsername === author && cashoutTime !== '1969-12-31T23:59:59';
    const displayBeneficiaries = !_.isEmpty(beneficiaries);
    const isLastElement = !(displayEditPostButton || displayBeneficiaries);

    return (
      <TouchableWithoutFeedback onPress={hideMenu}>
        <View style={commonStyles.menuModalContainer}>
          <MenuWrapper>
            <SavePostMenuButton
              title={title}
              permlink={permlink}
              author={author}
              id={id}
              created={created}
            />
            <SavePostOfflineMenuButton postData={postData} />
            <MenuModalButton onPress={this.handleNavigateToComments}>
              <MenuModalContents>
                <MenuIcon name={MATERIAL_COMMUNITY_ICONS.comment} />
                <MenuText customTheme={customTheme}>{intl.comments}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            {displayPhotoBrowserMenu && (
              <MenuModalButton onPress={handleDisplayPhotoBrowser}>
                <MenuModalContents>
                  <MenuIcon name={MATERIAL_COMMUNITY_ICONS.image} />
                  <MenuText>{intl.post_images}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            )}
            {displayReportButton && (
              <ReportPostMenuButton
                title={title}
                permlink={permlink}
                author={author}
                id={id}
                created={created}
              />
            )}
            <MenuModalButton onPress={this.handleShare}>
              <MenuModalContents>
                <MenuIcon name={MATERIAL_COMMUNITY_ICONS.shareVariant} />
                <MenuText customTheme={customTheme}>{intl.share_post}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.handleSetSteemitRLClipboard}>
              <MenuModalContents>
                <MenuIcon name={MATERIAL_COMMUNITY_ICONS.contentCopy} />
                <MenuText customTheme={customTheme}>{intl.copy_steemit_url}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.handleSetBusyURLClipboard} isLastElement={isLastElement}>
              <MenuModalContents>
                <MenuIcon name={MATERIAL_COMMUNITY_ICONS.contentCopy} />
                <MenuText customTheme={customTheme}>{intl.copy_busy_url}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            {displayEditPostButton && (
              <MenuModalButton onPress={this.handleEditPost}>
                <MenuModalContents>
                  <MenuIcon name={MATERIAL_COMMUNITY_ICONS.pencil} />
                  <MenuText customTheme={customTheme}>{intl.edit_post}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            )}
            {displayBeneficiaries && (
              <MenuModalButton onPress={this.handleBeneficiariesNavigation} isLastElement>
                <MenuModalContents>
                  <MenuIcon isMaterialIcon name={MATERIAL_ICONS.moneyOff} />
                  <MenuText customTheme={customTheme}>{intl.view_beneficiaries}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            )}
          </MenuWrapper>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(PostMenu));
