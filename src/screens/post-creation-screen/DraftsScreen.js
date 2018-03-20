import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { RefreshControl } from 'react-native';
import _ from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import * as firebaseActions from 'state/actions/firebaseActions';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import BackButton from 'components/common/BackButton';
import { getDrafts, getLoadingDrafts } from 'state/rootReducer';
import i18n from 'i18n/i18n';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import BodyShort from 'components/post-preview/BodyShort';

const Container = styled.View``;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TitleText = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
  margin-left: 3px;
`;

const DraftContainer = styled.View`
  padding: 5px 10px;
  margin: 5px 0;
  background-color: ${COLORS.PRIMARY_BACKGROUND_COLOR};
  border-bottom-width: 1px;
  border-top-width: 1px;
  border-color: ${COLORS.PRIMARY_BORDER_COLOR};
`;

const DraftTitle = styled.Text`
  margin-left: 5px;
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 20px;
`;

const Touchable = styled.TouchableOpacity``;

const DeleteDraftContainer = styled.View`
  align-items: flex-end;
`;

const StyledScrollView = styled.ScrollView`
  height: 100%;
  background-color: ${COLORS.LIST_VIEW_BACKGROUND};
`;

const DraftPreview = ({ postData, handleSelectDraft, handleDeleteDraft }) => (
  <DraftContainer>
    <DeleteDraftContainer>
      <Touchable onPress={handleDeleteDraft(postData.draftID)}>
        <MaterialCommunityIcons
          name={MATERIAL_COMMUNITY_ICONS.closeCircle}
          size={30}
          color={COLORS.RED.VALENCIA}
        />
      </Touchable>
    </DeleteDraftContainer>
    <Touchable onPress={handleSelectDraft(postData)}>
      <DraftTitle>{postData.title}</DraftTitle>
      <BodyShort content={postData.body} />
    </Touchable>
  </DraftContainer>
);

DraftPreview.propTypes = {
  postData: PropTypes.shape().isRequired,
  handleSelectDraft: PropTypes.func.isRequired,
  handleDeleteDraft: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  drafts: getDrafts(state),
  loadingDrafts: getLoadingDrafts(state),
});

const mapDispatchToProps = dispatch => ({
  fetchDrafts: () => dispatch(firebaseActions.fetchDrafts.action()),
  deleteDraft: draftID => dispatch(firebaseActions.deleteDraft.action({ draftID })),
});

class DraftsScreen extends Component {
  static propTypes = {
    drafts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    loadingDrafts: PropTypes.bool.isRequired,
    fetchDrafts: PropTypes.func.isRequired,
    handleHideDrafts: PropTypes.func.isRequired,
    handleSelectDraft: PropTypes.func.isRequired,
    deleteDraft: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (_.isEmpty(this.props.drafts)) {
      this.props.fetchDrafts();
    }
  }

  handleDeleteDraft = draftID => () => this.props.deleteDraft(draftID);

  render() {
    const { handleHideDrafts, drafts, handleSelectDraft, loadingDrafts } = this.props;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={handleHideDrafts} iconName={MATERIAL_ICONS.close} />
          <TitleContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.noteMultipleOutline}
              color={COLORS.PRIMARY_COLOR}
            />
            <TitleText>{i18n.titles.drafts}</TitleText>
          </TitleContainer>
          <HeaderEmptyView />
        </Header>
        <StyledScrollView
          refreshControl={
            <RefreshControl
              refreshing={loadingDrafts}
              onRefresh={this.props.fetchDrafts}
              tintColor={COLORS.PRIMARY_COLOR}
              colors={[COLORS.PRIMARY_COLOR]}
            />
          }
        >
          {_.map(drafts, (draft, index) => (
            <DraftPreview
              key={index}
              postData={draft}
              handleSelectDraft={handleSelectDraft}
              handleDeleteDraft={this.handleDeleteDraft}
            />
          ))}
        </StyledScrollView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DraftsScreen);
