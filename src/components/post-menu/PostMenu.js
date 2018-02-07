import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import {
  COLORS,
  MATERIAL_ICONS,
  MATERIAL_COMMUNITY_ICONS,
  ICON_SIZES,
} from '../../constants/styles';
import { connect } from 'react-redux';
import MenuModalButton from '../common/menu/MenuModalButton';
import MenuWrapper from '../common/menu/MenuWrapper';
import SavePostMenuButton from './SavePostMenuButton';
import { getAuthUsername } from '../../state/rootReducer';

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

@connect(state => ({
  authUsername: getAuthUsername(state),
}))
class PostMenu extends Component {
  static propTypes = {
    handleFollowUser: PropTypes.func,
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
  };

  static defaultProps = {
    hideMenu: () => {},
    handleFollowUser: () => {},
    handleLikePost: () => {},
    handleNavigateToComments: () => {},
    handleReblog: () => {},
    handleReportPost: () => {},
  };

  render() {
    const {
      hideMenu,
      handleFollowUser,
      handleLikePost,
      handleNavigateToComments,
      handleReblog,
      handleReportPost,
      postData,
      authUsername,
    } = this.props;
    const { title, permlink, author, id, created } = postData;
    const displayMenuButton = authUsername !== author;

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
            {displayMenuButton && (
              <MenuModalButton onPress={handleFollowUser}>
                <MenuModalContents>
                  <MaterialIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    name={MATERIAL_ICONS.follow}
                    color={COLORS.PRIMARY_COLOR}
                  />
                  <MenuText>Follow</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            )}
            <MenuModalButton onPress={handleNavigateToComments}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={COLORS.PRIMARY_COLOR}
                  name={MATERIAL_COMMUNITY_ICONS.comment}
                />
                <MenuText>Comments</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={handleLikePost}>
              <MenuModalContents>
                <MaterialIcons
                  size={ICON_SIZES.menuModalOptionIcon}
                  color={COLORS.PRIMARY_COLOR}
                  name={MATERIAL_ICONS.like}
                />
                <MenuText>Like Post</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            {displayMenuButton && (
              <MenuModalButton onPress={handleReblog}>
                <MenuModalContents>
                  <MaterialCommunityIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={COLORS.PRIMARY_COLOR}
                    name={MATERIAL_COMMUNITY_ICONS.reblog}
                  />
                  <MenuText>Reblog</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            )}
            {displayMenuButton && (
              <MenuModalButton onPress={handleReportPost}>
                <MenuModalContents>
                  <MaterialIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={COLORS.PRIMARY_COLOR}
                    name={MATERIAL_ICONS.report}
                  />
                  <MenuText>Report Post</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            )}
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default PostMenu;
