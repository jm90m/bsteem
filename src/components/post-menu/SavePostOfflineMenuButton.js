import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getSavedOfflinePosts, getIntl, getPendingSavingPostsOffline } from 'state/rootReducer';
import { MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import { savePostOffline, unsavePostOffline } from 'state/actions/postsActions';
import MenuText from 'components/common/menu/MenuText';
import MenuModalContents from 'components/common/menu/MenuModalContents';
import MenuIcon from 'components/common/menu/MenuIcon';
import MenuModalButton from '../common/menu/MenuModalButton';
import SmallLoading from '../common/SmallLoading';

const mapStateToProps = state => ({
  savedOfflinePosts: getSavedOfflinePosts(state),
  intl: getIntl(state),
  pendingSavingPostsOffline: getPendingSavingPostsOffline(state),
});

const mapDispatchToProps = dispatch => ({
  savePostOffline: postData => dispatch(savePostOffline.action({ postData })),
  unsavePostOffline: postData => dispatch(unsavePostOffline.action({ postData })),
});

class SavePostOfflineMenuButton extends Component {
  static propTypes = {
    postData: PropTypes.shape(),
    savePostOffline: PropTypes.func.isRequired,
    unsavePostOffline: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    savedOfflinePosts: PropTypes.shape().isRequired,
    pendingSavingPostsOffline: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ).isRequired,
  };

  static defaultProps = {
    postData: {},
  };

  constructor(props) {
    super(props);

    this.handleSavePost = this.handleSavePost.bind(this);
    this.handleUnsavePost = this.handleUnsavePost.bind(this);
  }

  handleSavePost() {
    const { postData } = this.props;
    this.props.savePostOffline(postData);
  }

  handleUnsavePost() {
    const { postData } = this.props;
    this.props.unsavePostOffline(postData);
  }

  render() {
    const { postData, pendingSavingPostsOffline, savedOfflinePosts, intl } = this.props;
    const { id } = postData;
    const isLoading = _.includes(pendingSavingPostsOffline, id);
    const isSaved = !_.isNull(_.get(savedOfflinePosts, id, null));
    const menuText = isSaved ? intl.saved_offline : intl.save_offline;
    const onPress = isSaved ? this.handleUnsavePost : this.handleSavePost;

    return (
      <MenuModalButton onPress={onPress}>
        <MenuModalContents>
          {isLoading ? (
            <SmallLoading style={{ marginRight: 5 }} />
          ) : (
            <MenuIcon name={MATERIAL_COMMUNITY_ICONS.contentSave} />
          )}
          <MenuText>{menuText}</MenuText>
        </MenuModalContents>
      </MenuModalButton>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SavePostOfflineMenuButton);
