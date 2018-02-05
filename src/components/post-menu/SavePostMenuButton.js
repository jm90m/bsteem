import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getPendingSavingPosts, getSavedPosts } from 'state/rootReducer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import { savePost, unsavePost } from '../../state/actions/firebaseActions';
import MenuModalButton from '../common/menu/MenuModalButton';
import SmallLoading from '../common/SmallLoading';

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

@connect(
  state => ({
    pendingSavingPosts: getPendingSavingPosts(state),
    savedPosts: getSavedPosts(state),
  }),
  dispatch => ({
    savePost: (author, permlink, title, id) =>
      dispatch(savePost.action({ author, permlink, title, id })),
    unsavePost: id => dispatch(unsavePost.action({ id })),
  }),
)
class SavePostMenuButton extends Component {
  static propTypes = {
    savePost: PropTypes.func.isRequired,
    unsavePost: PropTypes.func.isRequired,
    title: PropTypes.string,
    permlink: PropTypes.string,
    author: PropTypes.string,
    id: PropTypes.number,
    pendingSavingPosts: PropTypes.arrayOf(PropTypes.number),
    savedPosts: PropTypes.arrayOf(PropTypes.shape()),
  };

  constructor(props) {
    super(props);

    this.handleSavePost = this.handleSavePost.bind(this);
    this.handleUnsavePost = this.handleUnsavePost.bind(this);
  }

  handleSavePost() {
    const { title, author, permlink, id } = this.props;
    this.props.savePost(author, permlink, title, id);
  }

  handleUnsavePost() {
    const { id } = this.props;
    this.props.unsavePost(id);
  }

  render() {
    const { id, pendingSavingPosts, savedPosts } = this.props;

    const isLoading = _.includes(pendingSavingPosts, id);
    const isSaved = _.findIndex(savedPosts, post => post.id === id) > -1;
    const menuText = isSaved ? 'Saved Post' : 'Save Post';
    const menuIcon = isSaved
      ? MATERIAL_COMMUNITY_ICONS.savedPost
      : MATERIAL_COMMUNITY_ICONS.savePost;
    const onPress = isSaved ? this.handleUnsavePost : this.handleSavePost;

    return (
      <MenuModalButton onPress={onPress}>
        <MenuModalContents>
          {isLoading ? (
            <SmallLoading style={{ marginRight: 5 }} />
          ) : (
            <MaterialCommunityIcons
              size={ICON_SIZES.menuModalOptionIcon}
              color={COLORS.PRIMARY_COLOR}
              name={menuIcon}
            />
          )}
          <MenuText>{menuText}</MenuText>
        </MenuModalContents>
      </MenuModalButton>
    );
  }
}

export default SavePostMenuButton;
