import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';
import styled from 'styled-components/native';
import { COLORS, ICON_SIZES, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import MenuWrapper from 'components/common/menu/MenuWrapper';
import BSteemModal from 'components/common/BSteemModal';
import i18n from 'i18n/i18n';
import SmallLoading from 'components/common/SmallLoading';

const Container = styled.View`
  flex: 1;
  flex-direction: column-reverse;
  align-items: center;
`;

const MenuModalContents = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StatusContent = styled(MenuModalContents)`
  padding: 10px;
  margin-top: 4px;
  background: ${COLORS.PRIMARY_BACKGROUND_COLOR};
`;

const MenuText = styled.Text`
  margin-left: 5px;
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const StatusText = styled.Text`
  margin-left: 5px;
  color: ${COLORS.SECONDARY_COLOR};
`;

class PostCreationMenu extends Component {
  static propTypes = {
    hideMenu: PropTypes.func.isRequired,
    menuVisible: PropTypes.bool.isRequired,
    handleShowPreview: PropTypes.func.isRequired,
    handleSavePost: PropTypes.func.isRequired,
    loadingSavingDraft: PropTypes.bool.isRequired,
    savePostError: PropTypes.bool.isRequired,
    savePostSuccess: PropTypes.bool.isRequired,
  };

  renderSavePostStatus() {
    const { loadingSavingDraft, savePostError, savePostSuccess } = this.props;

    if (loadingSavingDraft) {
      return (
        <StatusContent>
          <SmallLoading />
          <StatusText style={{ color: COLORS.PRIMARY_COLOR }}>{i18n.editor.savingPost}</StatusText>
        </StatusContent>
      );
    } else if (savePostError) {
      return (
        <StatusContent>
          <MaterialIcons
            size={ICON_SIZES.menuModalOptionIcon}
            color={COLORS.RED.VALENCIA}
            name={MATERIAL_ICONS.warning}
          />
          <StatusText style={{ color: COLORS.RED.VALENCIA }}>
            {i18n.editor.errorSavingEmptyTitleOrBody}
          </StatusText>
        </StatusContent>
      );
    } else if (savePostSuccess) {
      return (
        <StatusContent>
          <MaterialIcons
            size={ICON_SIZES.menuModalOptionIcon}
            color={COLORS.BLUE.MEDIUM_AQUAMARINE}
            name={MATERIAL_ICONS.checkCircle}
          />
          <StatusText style={{ color: COLORS.BLUE.MEDIUM_AQUAMARINE }}>
            {i18n.editor.postSavedToDrafts}
          </StatusText>
        </StatusContent>
      );
    }
    return null;
  }

  render() {
    const { menuVisible, hideMenu, handleShowPreview, handleSavePost } = this.props;
    return (
      <BSteemModal visible={menuVisible} handleOnClose={hideMenu}>
        <TouchableWithoutFeedback onPress={hideMenu}>
          <Container>
            <MenuWrapper>
              <MenuModalButton onPress={handleShowPreview}>
                <MenuModalContents>
                  <MaterialCommunityIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={COLORS.PRIMARY_COLOR}
                    name={MATERIAL_COMMUNITY_ICONS.magnify}
                  />
                  <MenuText>{i18n.editor.postPreview}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
              <MenuModalButton onPress={handleSavePost}>
                <MenuModalContents>
                  <MaterialIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={COLORS.PRIMARY_COLOR}
                    name={MATERIAL_ICONS.save}
                  />
                  <MenuText>{i18n.editor.savePost}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
              {this.renderSavePostStatus()}
            </MenuWrapper>
          </Container>
        </TouchableWithoutFeedback>
      </BSteemModal>
    );
  }
}

export default PostCreationMenu;
