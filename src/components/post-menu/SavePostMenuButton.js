import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getPendingSavingPosts, getSavedPosts } from 'state/rootReducer';
import MenuText from 'components/common/menu/MenuText';
import MenuModalContents from 'components/common/menu/MenuModalContents';
import { MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import MenuIcon from 'components/common/menu/MenuIcon';
import { savePost, unsavePost } from '../../state/actions/firebaseActions';
import MenuModalButton from '../common/menu/MenuModalButton';
import SmallLoading from '../common/SmallLoading';

const mapStateToProps = state => ({
  pendingSavingPosts: getPendingSavingPosts(state),
  savedPosts: getSavedPosts(state),
});

const mapDispatchToProps = dispatch => ({
  savePost: (author, permlink, title, id, created) =>
    dispatch(savePost.action({ author, permlink, title, id, created })),
  unsavePost: id => dispatch(unsavePost.action({ id })),
});

class SavePostMenuButton extends Component {
  static propTypes = {
    savePost: PropTypes.func.isRequired,
    unsavePost: PropTypes.func.isRequired,
    title: PropTypes.string,
    permlink: PropTypes.string,
    author: PropTypes.string,
    id: PropTypes.number,
    created: PropTypes.string,
    pendingSavingPosts: PropTypes.arrayOf(PropTypes.number),
    savedPosts: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    title: '',
    permlink: '',
    author: '',
    id: 0,
    created: '',
    pendingSavingPosts: [],
    savedPosts: [],
  };

  constructor(props) {
    super(props);

    this.handleSavePost = this.handleSavePost.bind(this);
    this.handleUnsavePost = this.handleUnsavePost.bind(this);
  }

  handleSavePost() {
    const { title, author, permlink, id, created } = this.props;
    this.props.savePost(author, permlink, title, id, created);
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
          {isLoading ? <SmallLoading style={{ marginRight: 5 }} /> : <MenuIcon name={menuIcon} />}
          <MenuText>{menuText}</MenuText>
        </MenuModalContents>
      </MenuModalButton>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SavePostMenuButton);
