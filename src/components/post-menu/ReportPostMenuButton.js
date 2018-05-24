import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as settingsActions from 'state/actions/settingsActions';
import { MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import SmallLoading from 'components/common/SmallLoading';
import {
  getPendingReportingPosts,
  getReportedPosts,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import MenuModalButton from '../common/menu/MenuModalButton';

const MenuText = styled.Text`
  margin-left: 5px;
  color: ${props => props.customTheme.primaryColor};
  font-weight: bold;
`;

const MenuModalContents = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const mapStateToProps = state => ({
  pendingReportingPosts: getPendingReportingPosts(state),
  reportedPosts: getReportedPosts(state),
  customTheme: getCustomTheme(state),
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
    customTheme: PropTypes.shape().isRequired,
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
    const { id, pendingReportingPosts, reportedPosts, customTheme, intl } = this.props;

    const isLoading = _.includes(pendingReportingPosts, id);
    const isReported = _.findIndex(reportedPosts, post => post.id === id) > -1;
    const menuText = isReported ? intl.reported_post : intl.report_post;
    const menuIconColor = isReported ? customTheme.tertiaryColor : customTheme.primaryColor;
    const onPress = isReported ? this.handleUnreportPost : this.handleReportPost;

    return (
      <MenuModalButton onPress={onPress}>
        <MenuModalContents>
          {isLoading ? (
            <SmallLoading style={{ marginRight: 5 }} />
          ) : (
            <MaterialIcons
              size={ICON_SIZES.menuModalOptionIcon}
              color={menuIconColor}
              name={MATERIAL_ICONS.report}
            />
          )}
          <MenuText customTheme={customTheme}>{menuText}</MenuText>
        </MenuModalContents>
      </MenuModalButton>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportPostMenuButton);
