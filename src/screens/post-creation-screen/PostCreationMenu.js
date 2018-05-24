import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { ICON_SIZES, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import MenuModalButton from 'components/common/menu/MenuModalButton';
import { connect } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import MenuWrapper from 'components/common/menu/MenuWrapper';
import BSteemModal from 'components/common/BSteemModal';
import SmallLoading from 'components/common/SmallLoading';
import { updateEnableUserSignature } from 'state/actions/settingsActions';
import { getCustomTheme, getIntl, getEnableSignature } from '../../state/rootReducer';

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
  background: ${props => props.customTheme.primaryBackgroundColor};
`;

const MenuText = styled.Text`
  margin-left: 5px;
  color: ${props => props.customTheme.primaryColor};
  font-weight: bold;
`;

const StatusText = styled.Text`
  margin-left: 5px;
  color: ${props => props.customTheme.secondaryColor};
`;

class PostCreationMenu extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    hideMenu: PropTypes.func.isRequired,
    menuVisible: PropTypes.bool.isRequired,
    handleShowPreview: PropTypes.func.isRequired,
    handleSavePost: PropTypes.func.isRequired,
    loadingSavingDraft: PropTypes.bool.isRequired,
    handleEditSignature: PropTypes.func.isRequired,
    savePostError: PropTypes.bool.isRequired,
    savePostSuccess: PropTypes.bool.isRequired,
    enableSignature: PropTypes.bool.isRequired,
    updateEnableUserSignature: PropTypes.func.isRequired,
    handleErasePost: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.handleToggleSignature = this.handleToggleSignature.bind(this);
  }

  handleToggleSignature() {
    const { enableSignature } = this.props;
    this.props.updateEnableUserSignature(!enableSignature);
  }

  renderSavePostStatus() {
    const { loadingSavingDraft, savePostError, savePostSuccess, customTheme, intl } = this.props;

    if (loadingSavingDraft) {
      return (
        <StatusContent customTheme={customTheme}>
          <SmallLoading />
          <StatusText style={{ color: customTheme.primaryColor }} customTheme={customTheme}>
            {intl.saving}
          </StatusText>
        </StatusContent>
      );
    } else if (savePostError) {
      return (
        <StatusContent customTheme={customTheme}>
          <MaterialIcons
            size={ICON_SIZES.menuModalOptionIcon}
            color={customTheme.negativeColor}
            name={MATERIAL_ICONS.warning}
          />
          <StatusText style={{ color: customTheme.negativeColor }} customTheme={customTheme}>
            {intl.error_saving_empty_title_or_body}
          </StatusText>
        </StatusContent>
      );
    } else if (savePostSuccess) {
      return (
        <StatusContent customTheme={customTheme}>
          <MaterialIcons
            size={ICON_SIZES.menuModalOptionIcon}
            color={customTheme.positiveColor}
            name={MATERIAL_ICONS.checkCircle}
          />
          <StatusText style={{ color: customTheme.positiveColor }} customTheme={customTheme}>
            {intl.post_saved_to_drafts}
          </StatusText>
        </StatusContent>
      );
    }
    return null;
  }

  render() {
    const {
      menuVisible,
      hideMenu,
      handleShowPreview,
      handleSavePost,
      customTheme,
      intl,
      handleEditSignature,
      enableSignature,
      handleErasePost,
    } = this.props;
    return (
      <BSteemModal visible={menuVisible} handleOnClose={hideMenu}>
        <TouchableWithoutFeedback onPress={hideMenu}>
          <Container>
            <MenuWrapper>
              <MenuModalButton onPress={handleShowPreview}>
                <MenuModalContents>
                  <MaterialCommunityIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={customTheme.primaryColor}
                    name={MATERIAL_COMMUNITY_ICONS.magnify}
                  />
                  <MenuText customTheme={customTheme}>{intl.post_preview}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
              <MenuModalButton onPress={handleSavePost}>
                <MenuModalContents>
                  <MaterialIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={customTheme.primaryColor}
                    name={MATERIAL_ICONS.save}
                  />
                  <MenuText customTheme={customTheme}>{intl.save_post}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
              {this.renderSavePostStatus()}
              <MenuModalButton onPress={handleEditSignature}>
                <MenuModalContents>
                  <MaterialCommunityIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={customTheme.primaryColor}
                    name={MATERIAL_COMMUNITY_ICONS.approval}
                  />
                  <MenuText customTheme={customTheme}>{intl.edit_signature}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
              <MenuModalButton>
                <MenuModalContents>
                  <CheckBox
                    title={intl.use_signature}
                    checked={enableSignature}
                    onPress={this.handleToggleSignature}
                  />
                </MenuModalContents>
              </MenuModalButton>
              <MenuModalButton onPress={handleErasePost} style={{ marginTop: 20 }}>
                <MenuModalContents>
                  <MaterialCommunityIcons
                    size={ICON_SIZES.menuModalOptionIcon}
                    color={customTheme.primaryColor}
                    name={MATERIAL_COMMUNITY_ICONS.eraser}
                  />
                  <MenuText customTheme={customTheme}>{intl.erase_post}</MenuText>
                </MenuModalContents>
              </MenuModalButton>
            </MenuWrapper>
          </Container>
        </TouchableWithoutFeedback>
      </BSteemModal>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
  enableSignature: getEnableSignature(state),
});

const mapDispatchToProps = dispatch => ({
  updateEnableUserSignature: enableSignature =>
    dispatch(updateEnableUserSignature.action({ enableSignature })),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostCreationMenu);
