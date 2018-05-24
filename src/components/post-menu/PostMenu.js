import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, Share, Clipboard } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bsteemShareText, getBusyUrl, getSteemitURL } from 'util/bsteemUtils';
import ReportPostMenuButton from './ReportPostMenuButton';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from '../../constants/styles';
import MenuModalButton from '../common/menu/MenuModalButton';
import MenuWrapper from '../common/menu/MenuWrapper';
import SavePostMenuButton from './SavePostMenuButton';
import SavePostOfflineMenuButton from './SavePostOfflineMenuButton';
import {
  getAuthUsername,
  getCurrentUserFollowList,
  getCustomTheme,
  getIntl,
} from '../../state/rootReducer';

const Container = styled.View`
  align-items: center;
  flex-direction: column-reverse;
  flex: 1;
`;

const MenuText = styled.Text`
  margin-left: 5px;
  color: ${props => props.customTheme.primaryColor};
  font-weight: bold;
`;

const MenuModalContents = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

class PostMenu extends Component {
  static propTypes = {
    handleNavigateToComments: PropTypes.func,
    handleReblog: PropTypes.func,
    hideMenu: PropTypes.func,
    postData: PropTypes.shape({
      author: PropTypes.string,
      title: PropTypes.string,
      permlink: PropTypes.string,
      id: PropTypes.number,
    }),
    authUsername: PropTypes.string.isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    rebloggedList: PropTypes.arrayOf(PropTypes.string),
    hideReblogMenu: PropTypes.bool,
    displayPhotoBrowserMenu: PropTypes.bool,
    handleDisplayPhotoBrowser: PropTypes.func,
    handleEditPost: PropTypes.func,
  };

  static defaultProps = {
    postData: {},
    rebloggedList: [],
    hideReblogMenu: false,
    displayPhotoBrowserMenu: false,
    hideMenu: () => {},
    handleNavigateToComments: () => {},
    handleReblog: () => {},
    handleDisplayPhotoBrowser: () => {},
    handleEditPost: () => {},
  };

  constructor(props) {
    super(props);

    this.handleShare = this.handleShare.bind(this);
    this.handleSetBusyURLClipboard = this.handleSetBusyURLClipboard.bind(this);
    this.handleSetSteemitRLClipboard = this.handleSetSteemitRLClipboard.bind(this);
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

  render() {
    const {
      hideMenu,
      handleNavigateToComments,
      handleReblog,
      handleEditPost,
      postData,
      authUsername,
      rebloggedList,
      hideReblogMenu,
      displayPhotoBrowserMenu,
      handleDisplayPhotoBrowser,
      customTheme,
      intl,
    } = this.props;
    const { title, permlink, author, id, created, cashout_time } = postData;
    const displayMenuButton = authUsername !== author && !_.isEmpty(authUsername);
    const isReblogged = _.includes(rebloggedList, `${id}`);
    const hideReblog = !(displayMenuButton && !isReblogged) || hideReblogMenu;
    const displayReportButton = authUsername !== author;
    const displayEditPostButton = authUsername === author && cashout_time !== '1969-12-31T23:59:59';

    return (
      <TouchableWithoutFeedback onPress={hideMenu}>
        <Container>
          <MenuWrapper>
            <SavePostMenuButton
              title={title}
              permlink={permlink}
              author={author}
              id={id}
              created={created}
            />
            <SavePostOfflineMenuButton postData={postData} />
            <MenuModalButton onPress={handleNavigateToComments}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={customTheme.primaryColor}
                  name={MATERIAL_COMMUNITY_ICONS.comment}
                />
                <MenuText customTheme={customTheme}>{intl.comments}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            {!hideReblog && (
              <MenuModalButton onPress={handleReblog}>
                <MenuModalContents>
                  <MaterialCommunityIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={customTheme.primaryColor}
                    name={MATERIAL_COMMUNITY_ICONS.reblog}
                  />
                  <MenuText customTheme={customTheme}>{intl.reblog}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            )}
            {displayPhotoBrowserMenu && (
              <MenuModalButton onPress={handleDisplayPhotoBrowser}>
                <MenuModalContents>
                  <MaterialCommunityIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={customTheme.primaryColor}
                    name={MATERIAL_COMMUNITY_ICONS.image}
                  />
                  <MenuText customTheme={customTheme}>{intl.post_images}</MenuText>
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
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={customTheme.primaryColor}
                  name={MATERIAL_COMMUNITY_ICONS.shareVariant}
                />
                <MenuText customTheme={customTheme}>{intl.share_post}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.handleSetSteemitRLClipboard}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={customTheme.primaryColor}
                  name={MATERIAL_COMMUNITY_ICONS.contentCopy}
                />
                <MenuText customTheme={customTheme}>{intl.copy_steemit_url}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.handleSetBusyURLClipboard}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={customTheme.primaryColor}
                  name={MATERIAL_COMMUNITY_ICONS.contentCopy}
                />
                <MenuText customTheme={customTheme}>{intl.copy_busy_url}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            {displayEditPostButton && (
              <MenuModalButton onPress={handleEditPost}>
                <MenuModalContents>
                  <MaterialCommunityIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={customTheme.primaryColor}
                    name={MATERIAL_COMMUNITY_ICONS.pencil}
                  />
                  <MenuText customTheme={customTheme}>{intl.edit_post}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            )}
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  authUsername: getAuthUsername(state),
  followingList: getCurrentUserFollowList(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(PostMenu);
