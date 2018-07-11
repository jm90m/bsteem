import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as settingsActions from 'state/actions/settingsActions';
import { MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import SmallLoading from 'components/common/SmallLoading';
import MenuText from 'components/common/menu/MenuText';
import MenuIcon from 'components/common/menu/MenuIcon';
import MenuModalContents from 'components/common/menu/MenuModalContents';
import { getPendingReportingPosts, getReportedPosts, getIntl } from 'state/rootReducer';
import MenuModalButton from '../common/menu/MenuModalButton';

const mapStateToProps = state => ({
  pendingReportingPosts: getPendingReportingPosts(state),
  reportedPosts: getReportedPosts(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  reportPost: (author, permlink, title, id, created) =>
    dispatch(settingsActions.reportPost.action({ author, permlink, title, id, created })),
  unreportPost: id => dispatch(settingsActions.unreportPost.action({ id })),
});

class ReportPostMenuButton extends Component {
  static propTypes = {
    reportPost: PropTypes.func.isRequired,
    unreportPost: PropTypes.func.isRequired,
    title: PropTypes.string,
    permlink: PropTypes.string,
    author: PropTypes.string,
    id: PropTypes.number,
    created: PropTypes.string,
    pendingReportingPosts: PropTypes.arrayOf(PropTypes.number),
    reportedPosts: PropTypes.arrayOf(PropTypes.shape()),
    intl: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    title: '',
    permlink: '',
    author: '',
    id: 0,
    created: '',
    pendingReportingPosts: [],
    reportedPosts: [],
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
    const { id, pendingReportingPosts, reportedPosts, intl } = this.props;

    const isLoading = _.includes(pendingReportingPosts, id);
    const isReported = _.findIndex(reportedPosts, post => post.id === id) > -1;
    const menuText = isReported ? intl.reported_post : intl.report_post;
    const menuIcon = isReported
      ? MATERIAL_COMMUNITY_ICONS.alertCircle
      : MATERIAL_COMMUNITY_ICONS.alertCircleOutline;
    const onPress = isReported ? this.handleUnreportPost : this.handleReportPost;

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

export default connect(mapStateToProps, mapDispatchToProps)(ReportPostMenuButton);
