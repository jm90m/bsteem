import React, { Component } from 'react';
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
  color: ${COLORS.BLUE.MARINER};
  font-weight: bold;
`;

const MenuModalContents = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

class PostMenu extends Component {
  handleFollowUser = () => {};
  handleLikePost = () => {};
  handleNavigateToComments = () => {};
  handleReblog = () => {};
  handleReportPost = () => {};

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.hideMenu}>
        <Container>
          <MenuWrapper>
            <MenuModalButton onPress={this.handleFollowUser}>
              <MenuModalContents>
                <MaterialIcons size={20} name={MATERIAL_ICONS.follow} color={COLORS.BLUE.MARINER} />
                <MenuText>
                  Follow
                </MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.handleNavigateToComments}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={20}
                  color={COLORS.BLUE.MARINER}
                  name={MATERIAL_COMMUNITY_ICONS.comment}
                />
                <MenuText>
                  Comments
                </MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.handleLikePost}>
              <MenuModalContents>
                <MaterialIcons size={20} color={COLORS.BLUE.MARINER} name={MATERIAL_ICONS.like} />
                <MenuText>
                  Like Post
                </MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.handleReblog}>
              <MenuModalContents>
                <MaterialCommunityIcons
                  size={20}
                  color={COLORS.BLUE.MARINER}
                  name={MATERIAL_COMMUNITY_ICONS.reblog}
                />
                <MenuText>
                  Reblog
                </MenuText>
              </MenuModalContents>
            </MenuModalButton>
            <MenuModalButton onPress={this.handleReportPost}>
              <MenuModalContents>
                <MaterialIcons size={20} color={COLORS.BLUE.MARINER} name={MATERIAL_ICONS.report} />
                <MenuText>
                  Report Post
                </MenuText>
              </MenuModalContents>
            </MenuModalButton>
          </MenuWrapper>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

export default PostMenu;
