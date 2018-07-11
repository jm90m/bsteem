import React from 'react';
import PropTypes from 'prop-types';
import { MATERIAL_ICONS } from 'constants/styles';
import _ from 'lodash';
import { Modal, ScrollView } from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';
import { connect } from 'react-redux';
import ReportPostButton from 'components/common/ReportPostButton';
import PostPreview from 'components/saved-content/PostPreview';
import styled from 'styled-components/native';
import Header from 'components/common/Header';
import TitleText from 'components/common/TitleText';
import BackButton from 'components/common/BackButton';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import { getIntl, getReportedPosts } from '../../state/rootReducer';
import StyledViewPrimaryBackground from '../common/StyledViewPrimaryBackground';
import StyledTextByBackground from '../common/StyledTextByBackground';

const mapStateToProps = state => ({
  intl: getIntl(state),
  reportedPosts: getReportedPosts(state),
});

const EmptyContent = styled(StyledViewPrimaryBackground)`
  padding: 20px;
`;

const EmptyText = styled(StyledTextByBackground)`
  font-size: 18px;
`;

const EmptyView = styled.View`
  width: 100px;
  height: 300px;
`;

class ReportedPostsModal extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    reportedPosts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    displayReportedPostsModal: PropTypes.bool,
    handleNavigatePost: PropTypes.func,
    handleNavigateUser: PropTypes.func,
    hideReportedPostsModal: PropTypes.func,
  };

  static defaultProps = {
    displayReportedPostsModal: false,
    handleNavigatePost: () => {},
    handleNavigateUser: () => {},
    hideReportedPostsModal: () => {},
  };

  renderReportedPosts() {
    const { reportedPosts, intl, handleNavigatePost, handleNavigateUser } = this.props;
    const reportedPostsPreview = _.map(reportedPosts, post => (
      <PostPreview
        key={post.id}
        handleNavigatePost={() => handleNavigatePost(post.author, post.permlink)}
        handleNavigateUser={() => handleNavigateUser(post.author)}
        author={post.author}
        created={post.created}
        title={post.title}
        actionComponent={
          <ReportPostButton
            title={post.title}
            permlink={post.permlink}
            author={post.author}
            id={post.id}
            created={post.created}
          />
        }
      />
    ));
    return _.isEmpty(reportedPostsPreview) ? (
      <EmptyContent>
        <EmptyText>{intl.noReportedPosts}</EmptyText>
      </EmptyContent>
    ) : (
      reportedPostsPreview
    );
  }
  render() {
    const { displayReportedPostsModal, hideReportedPostsModal, intl } = this.props;
    return (
      <Modal
        animationType="slide"
        visible={displayReportedPostsModal}
        onRequestClose={hideReportedPostsModal}
      >
        <SafeAreaView>
          <Header>
            <HeaderEmptyView />
            <TitleText>{intl.reportedPosts}</TitleText>
            <BackButton navigateBack={hideReportedPostsModal} iconName={MATERIAL_ICONS} />
          </Header>
          <ScrollView>
            {this.renderReportedPosts()}
            <EmptyView />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }
}

export default connect(mapStateToProps)(ReportedPostsModal);
