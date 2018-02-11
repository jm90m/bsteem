import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import i18n from 'i18n/i18n';
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
    handleLikePost: PropTypes.func,
    handleNavigateToComments: PropTypes.func,
    handleReblog: PropTypes.func,
    handleReportPost: PropTypes.func,
    hideMenu: PropTypes.func,
    postData: PropTypes.shape({
      author: PropTypes.string,
      title: PropTypes.string,
      permlink: PropTypes.string,
      id: PropTypes.number,
    }),
    authUsername: PropTypes.string.isRequired,
    likedPost: PropTypes.bool,
  };

  static defaultProps = {
    postData: {},
    hideMenu: () => {},
    handleLikePost: () => {},
    handleNavigateToComments: () => {},
    handleReblog: () => {},
    handleReportPost: () => {},
    likedPost: false,
  };

  render() {
    const {
      hideMenu,
      handleLikePost,
      handleNavigateToComments,
      handleReblog,
      handleReportPost,
      postData,
      authUsername,
      rebloggedList,
      likedPost,
    } = this.props;
    const { title, permlink, author, id, created } = postData;
    const displayMenuButton = authUsername !== author;
    const isReblogged = _.includes(rebloggedList, `${id}`);
    const renderReportPost = false;

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
            <MenuModalButton onPress={handleLikePost}>
              <MenuModalContents>
                <MaterialIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={COLORS.PRIMARY_COLOR}
                  name={MATERIAL_ICONS.like}
                />
                <MenuText>{likedPost ? i18n.postMenu.unlikePost : i18n.postMenu.likePost}</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            {displayMenuButton &&
              !isReblogged && (
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
            {displayMenuButton &&
              renderReportPost && (
                <MenuModalButton onPress={handleReportPost}>
                  <MenuModalContents>
                    <MaterialIcons
                      size={ICON_SIZES.menuModalOptionIcon}
                      color={COLORS.PRIMARY_COLOR}
                      name={MATERIAL_ICONS.report}
                    />
                    <MenuText>{i18n.postMenu.reportPost}</MenuText>
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
