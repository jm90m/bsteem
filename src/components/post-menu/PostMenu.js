import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from '../../constants/styles';
import MenuModalButton from '../common/menu/MenuModalButton';
import MenuWrapper from '../common/menu/MenuWrapper';

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
    handleFollowUser: PropTypes.func,
    handleLikePost: PropTypes.func,
    handleNavigateToComments: PropTypes.func,
    handleReblog: PropTypes.func,
    handleReportPost: PropTypes.func,
    hideMenu: PropTypes.func,
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
    } = this.props;

    return (
      <TouchableWithoutFeedback onPress={hideMenu}>
        <Container>
          <MenuWrapper>
            <MenuModalButton onPress={handleFollowUser}>
              <MenuModalContents>
                <MaterialIcons
                  size={20}
                  name={MATERIAL_ICONS.follow}
                  color={COLORS.PRIMARY_COLOR}
                />
                <MenuText>Follow</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={handleNavigateToComments}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={20}
                  color={COLORS.PRIMARY_COLOR}
                  name={MATERIAL_COMMUNITY_ICONS.comment}
                />
                <MenuText>Comments</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={handleLikePost}>
              <MenuModalContents>
                <MaterialIcons size={20} color={COLORS.PRIMARY_COLOR} name={MATERIAL_ICONS.like} />
                <MenuText>Like Post</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={handleReblog}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={20}
                  color={COLORS.PRIMARY_COLOR}
                  name={MATERIAL_COMMUNITY_ICONS.reblog}
                />
                <MenuText>Reblog</MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={handleReportPost}>
              <MenuModalContents>
                <MaterialIcons
                  size={20}
                  color={COLORS.PRIMARY_COLOR}
                  name={MATERIAL_ICONS.report}
                />
                <MenuText>Report Post</MenuText>
              </MenuModalContents>
            </MenuModalButton>
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default PostMenu;
