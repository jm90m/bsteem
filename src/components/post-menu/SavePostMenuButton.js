import React, { Component } from 'react';
import styled from 'styled-components/native';
import { COLORS, MATERIAL_COMMUNITY_ICONS } from "../../constants/styles";
import { connect } from "react-redux";
import { getPendingSavingTags, getSavedTags } from "../../state/rootReducer";
import { saveTag, unsaveTag } from "../../state/actions/firebaseActions";

const Container = styled.View``;

// todo save posts
@connect(
  state => ({
    pendingSavingPosts: getPendingSavingPosts(state),
    savedPosts: getSavedPosts(state),
  }),
  dispatch => ({
    saveTag: tag => dispatch(saveTag.action({ tag })),
    unsaveTag: tag => dispatch(unsaveTag.action({ tag })),
  }),
)
class SavePostMenuButton extends Component {
  render() {
    return (
      <MenuModalButton onPress={() => {}}>
        <MenuModalContents>
          <MaterialCommunityIcons
            size={20}
            color={COLORS.PRIMARY_COLOR}
            name={MATERIAL_COMMUNITY_ICONS.comment}
          />
          <MenuText>
            Save Post
          </MenuText>
        </MenuModalContents>
    );
  }
}

export default SavePostMenuButton;
