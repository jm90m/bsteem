import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, Share } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import i18n from 'i18n/i18n';
import { bsteemShareText, getBusyUrl } from 'util/bsteemUtils';
import ReportPostMenuButton from './ReportPostMenuButton';
import {
  COLORS,
  MATERIAL_ICONS,
  MATERIAL_COMMUNITY_ICONS,
  ICON_SIZES,
} from '../../constants/styles';
import MenuModalButton from '../common/menu/MenuModalButton';
import MenuWrapper from '../common/menu/MenuWrapper';
import SavePostMenuButton from './SavePostMenuButton';
import { getAuthUsername, getCurrentUserFollowList } from '../../state/rootReducer';
import FollowMenuButton from './FollowMenuButton';
import SmallLoading from '../common/SmallLoading';

const Container = styled.View`
  align-items: center;
  flex-direction: column-reverse;
  flex: 1;
`;

const MenuText = styled.Text`
  margin-left: 5px;
  color: ${COLORS.PRIMARY_COLOR};
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
            {displayMenuButton && <FollowMenuButton username={author} />}
            <MenuModalButton onPress={handleNavigateToComments}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={COLORS.PRIMARY_COLOR}
                  name={MATERIAL_COMMUNITY_ICONS.comment}
                />
                <MenuText>{i18n.postMenu.comments}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            {!hideReblog && (
              <MenuModalButton onPress={handleReblog}>
                <MenuModalContents>
                  <MaterialCommunityIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={COLORS.PRIMARY_COLOR}
                    name={MATERIAL_COMMUNITY_ICONS.reblog}
                  />
                  <MenuText>{i18n.postMenu.reblog}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            )}
            {displayPhotoBrowserMenu && (
              <MenuModalButton onPress={handleDisplayPhotoBrowser}>
                <MenuModalContents>
                  <MaterialCommunityIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={COLORS.PRIMARY_COLOR}
                    name={MATERIAL_COMMUNITY_ICONS.image}
                  />
                  <MenuText>{i18n.postMenu.postImages}</MenuText>
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
                  color={COLORS.PRIMARY_COLOR}
                  name={MATERIAL_COMMUNITY_ICONS.shareVariant}
                />
                <MenuText>{i18n.postMenu.sharePost}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            {displayEditPostButton && (
              <MenuModalButton onPress={handleEditPost}>
                <MenuModalContents>
                  <MaterialCommunityIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={COLORS.PRIMARY_COLOR}
                    name={MATERIAL_COMMUNITY_ICONS.pencil}
                  />
                  <MenuText>{i18n.postMenu.editPost}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            )}
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default connect(state => ({
  authUsername: getAuthUsername(state),
  followingList: getCurrentUserFollowList(state),
}))(PostMenu);
