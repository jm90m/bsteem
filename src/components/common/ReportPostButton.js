import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_COMMUNITY_ICONS, COLORS, ICON_SIZES } from '../../constants/styles';
import * as settingsActions from 'state/actions/settingsActions';
import {
  getPendingSavingPosts, getPendingSavingTags, getSavedPosts,
  getSavedTags
} from '../../state/rootReducer';
import SmallLoading from './SmallLoading';
import { savePost, unsavePost } from "../../state/actions/firebaseActions";

const Touchable = styled.TouchableOpacity``;

@connect(
  state => ({
    pendingReportingPosts: getPendingReportingPosts(state),
    reportedPosts: getReportedPosts(state),
  }),
  dispatch => ({
    reportPost: (author, permlink, title, id, created) =>
      dispatch(settingsActions.reportPost.action({ author, permlink, title, id, created })),
    unreportPost: id => dispatch(settingsActions.unreportPost.action({ id })),
  }),
)
class ReportPostButton extends Component {
  static propTypes = {
    reportPost: PropTypes.func.isRequired,
    unreportPost: PropTypes.func.isRequired,
    title: PropTypes.string,
    permlink: PropTypes.string,
    author: PropTypes.string,
    id: PropTypes.number,
    created: PropTypes.string,
    pendingSavingPosts: PropTypes.arrayOf(PropTypes.number),
    savedPosts: PropTypes.arrayOf(PropTypes.shape()),
  };


  constructor(props) {
    super(props);


    this.handleReportPost = this.handleReportPost.bind(this);
    this.handleUnreportPost = this.handleUnreportPost.bind(this);
  }

  handleReportPost() {
    const { title, author, permlink, id, created } = this.props;
    this.props.reportPost(author, permlink, title, id, created);
  }

  handleUnreportPost() {
    const { id } = this.props;
    this.props.unreportPost(id);
  }

  render() {
    const { id, pendingSavingPosts, reportedPosts } = this.props;

    const isLoading = _.includes(pendingSavingPosts, id);
    const isReported = _.findIndex(reportedPosts, post => post.id === id) > -1;

    return isReported ? (
      <Touchable onPress={this.handleUnsaveTag}>
        <MaterialCommunityIcons
          name={MATERIAL_ICONS.report}
          size={ICON_SIZES.menuIcon}
          color={isReported ? COLORS.PRIMARY_COLOR : COLORS.TERTIARY_COLOR}
        />
      </Touchable>
    ) : (
      <Touchable onPress={this.handleSaveTag}>
        <MaterialCommunityIcons
          name={MATERIAL_COMMUNITY_ICONS.saveTag}
          size={ICON_SIZES.menuIcon}
          color={COLORS.PRIMARY_COLOR}
        />
      </Touchable>
    );
  }
}

export default ReportPostButton;
