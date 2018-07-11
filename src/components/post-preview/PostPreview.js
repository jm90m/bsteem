import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { jsonStringify } from 'util/bsteemUtils';
import { getDisplayNSFWContent, getReportedPosts, getCustomTheme } from 'state/rootReducer';
import { isPostTaggedNSFW } from 'util/postUtils';
import { getReputation } from 'util/steemitFormatters';
import withAuthActions from 'components/common/withAuthActions';
import Header from 'components/post-common/header/Header';
import PostFooter from 'components/post-common/footer/PostFooter';
import Title from './Title';
import HiddenPreviewText from './HiddenPreviewText';
import PreviewContent from './PreviewContent';

let BSteemModal = null;
let PostMenu = null;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  content: {
    paddingBottom: 10,
  },
});

const mapStateToProps = state => ({
  displayNSFWContent: getDisplayNSFWContent(state),
  reportedPosts: getReportedPosts(state),
  customTheme: getCustomTheme(state),
});

class PostPreview extends React.Component {
  static propTypes = {
    displayNSFWContent: PropTypes.bool.isRequired,
    customTheme: PropTypes.shape().isRequired,
    reportedPosts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    postData: PropTypes.shape(),
    currentUsername: PropTypes.string,
  };

  static defaultProps = {
    postData: {},
    currentUsername: '',
  };

  constructor(props) {
    super(props);
    const { postData, reportedPosts } = props;
    const postAuthorReputation = getReputation(postData.author_reputation);
    const isReported = _.findIndex(reportedPosts, post => post.id === postData.id) > -1;
    let displayPostPreview = true;

    if (postAuthorReputation >= 0 && isPostTaggedNSFW(postData)) {
      displayPostPreview = props.displayNSFWContent;
    } else if (postAuthorReputation < 0) {
      displayPostPreview = false;
    } else if (isReported) {
      displayPostPreview = false;
    }

    this.state = {
      displayMenu: false,
      displayPostPreview,
    };

    this.handleDisplayMenu = this.handleDisplayMenu.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.displayHiddenContent = this.displayHiddenContent.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const isDifferentReportedPosts = !_.isEqual(
      JSON.stringify(this.props.reportedPosts),
      JSON.stringify(nextProps.reportedPosts),
    );

    if (isDifferentReportedPosts) {
      const { postData } = this.props;
      const isReported = _.findIndex(nextProps.reportedPosts, post => post.id === postData.id) > -1;
      if (isReported) {
        this.setState({
          displayPostPreview: false,
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const diffDisplayMenu = this.state.displayMenu !== nextState.displayMenu;
    const diffDisplayPostPreview = this.state.displayPostPreview !== nextState.displayPostPreview;
    const diffPostData = jsonStringify(this.props.postData) !== jsonStringify(nextProps.postData);
    const diffReportedPosts =
      jsonStringify(this.props.reportedPosts) !== jsonStringify(nextProps.reportedPosts);
    const diffCurrentUsername = this.props.currentUsername !== nextProps.currentUsername;
    const diffDisplayNSFWContent = this.props.displayNSFWContent !== nextProps.displayNSFWContent;
    const diffCustomTheme = this.props.customTheme !== nextProps.customTheme;

    return (
      diffPostData ||
      diffDisplayMenu ||
      diffDisplayPostPreview ||
      diffCurrentUsername ||
      diffDisplayNSFWContent ||
      diffCustomTheme ||
      diffReportedPosts
    );
  }

  getDisplayPostPreview() {
    const { postData, displayNSFWContent, reportedPosts } = this.props;
    const { displayPostPreview } = this.state;
    const isReported = _.findIndex(reportedPosts, post => post.id === postData.id) > -1;
    const postAuthorReputation = getReputation(postData.author_reputation);

    if (displayPostPreview) return true;

    if (postAuthorReputation >= 0 && isPostTaggedNSFW(postData)) {
      return displayNSFWContent;
    } else if (postAuthorReputation < 0) {
      return false;
    } else if (isReported) {
      return false;
    }

    return true;
  }

  handleDisplayMenu() {
    if (BSteemModal === null) {
      BSteemModal = require('../common/BSteemModal').default;
    }

    if (PostMenu === null) {
      PostMenu = require('../post-menu/PostMenu').default;
    }

    this.setState({
      displayMenu: true,
    });
  }

  handleHideMenu() {
    this.setState({
      displayMenu: false,
    });
  }

  displayHiddenContent() {
    this.setState({
      displayPostPreview: true,
    });
  }

  render() {
    const { postData, currentUsername, customTheme } = this.props;
    const { displayMenu } = this.state;
    const showPostPreview = this.getDisplayPostPreview();

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: customTheme.primaryBackgroundColor,
            borderBottomColor: customTheme.primaryBorderColor,
          },
        ]}
      >
        <Header
          postData={postData}
          currentUsername={currentUsername}
          displayMenu={this.handleDisplayMenu}
        />
        <View style={styles.content}>
          <Title postData={postData} />
          {showPostPreview ? (
            <PreviewContent postData={postData} />
          ) : (
            <HiddenPreviewText
              postData={postData}
              displayHiddenContent={this.displayHiddenContent}
            />
          )}
        </View>
        <PostFooter votePressedCallback={this.handleHideMenu} postDetails={postData} />
        {displayMenu && (
          <BSteemModal visible={displayMenu} handleOnClose={this.handleHideMenu}>
            <PostMenu hideMenu={this.handleHideMenu} postData={postData} />
          </BSteemModal>
        )}
      </View>
    );
  }
}

export default connect(mapStateToProps)(withAuthActions(PostPreview));
