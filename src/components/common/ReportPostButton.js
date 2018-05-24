import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as settingsActions from 'state/actions/settingsActions';
import { MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import {
  getPendingReportingPosts,
  getReportedPosts,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import SmallLoading from './SmallLoading';

const Touchable = styled.TouchableOpacity``;

const ActionLink = styled.Text`
  color: ${props => props.customTheme.primaryColor};
  font-weight: bold;
`;

@connect(
  state => ({
    pendingReportingPosts: getPendingReportingPosts(state),
    reportedPosts: getReportedPosts(state),
    customTheme: getCustomTheme(state),
    intl: getIntl(state),
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
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    title: PropTypes.string,
    permlink: PropTypes.string,
    author: PropTypes.string,
    id: PropTypes.number,
    created: PropTypes.string,
    pendingReportingPosts: PropTypes.arrayOf(PropTypes.number),
    reportedPosts: PropTypes.arrayOf(PropTypes.shape()),
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
    const { id, pendingReportingPosts, reportedPosts, customTheme, intl } = this.props;

    const isLoading = _.includes(pendingReportingPosts, id);
    const isReported = _.findIndex(reportedPosts, post => post.id === id) > -1;
    const onPress = isReported ? this.handleUnreportPost : this.handleReportPost;
    const menuIconColor = isReported ? customTheme.primaryColor : customTheme.tertiaryColor;

    if (isLoading) {
      return <SmallLoading />;
    }

    if (isReported) {
      return (
        <Touchable onPress={this.handleUnreportPost}>
          <ActionLink customTheme={customTheme}>{intl.unreport_post}</ActionLink>
        </Touchable>
      );
    }

    return isLoading ? (
      <SmallLoading />
    ) : (
      <Touchable onPress={onPress}>
        <MaterialIcons
          name={MATERIAL_ICONS.report}
          size={ICON_SIZES.menuIcon}
          color={menuIconColor}
        />
      </Touchable>
    );
  }
}

export default ReportPostButton;
