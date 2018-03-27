import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import _ from 'lodash';
import { Modal, View } from 'react-native';
import { connect } from 'react-redux';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import i18n from 'i18n/i18n';
import { CheckBox } from 'react-native-elements';
import {
  getDisplayNSFWContent,
  getReportedPosts,
  getEnableVotingSlider,
  getIsAuthenticated,
} from 'state/rootReducer';
import * as settingsActions from 'state/actions/settingsActions';
import PrimaryButton from 'components/common/PrimaryButton';
import PostPreview from 'components/saved-content/PostPreview';
import * as navigationConstants from 'constants/navigation';
import ReportPostButton from 'components/common/ReportPostButton';

const EmptyContent = styled.View`
  padding: 20px;
  background-color: ${COLORS.WHITE.WHITE};
`;

const EmptyText = styled.Text`
  font-size: 18px;
`;

const Container = styled.View`
  flex: 1;
`;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const TitleText = styled.Text`
  font-weight: bold;
  color: ${COLORS.PRIMARY_COLOR};
`;

const ButtonContainer = styled.View`
  margin: 10px 0;
`;

const ScrollView = styled.ScrollView``;

const mapStateToProps = state => ({
  authenticated: getIsAuthenticated(state),
  displayNSFWContent: getDisplayNSFWContent(state),
  reportedPosts: getReportedPosts(state),
  enableVotingSlider: getEnableVotingSlider(state),
});

const mapDispatchToProps = dispatch => ({
  updateNSFWDisplaySettings: displayNSFWContent =>
    dispatch(settingsActions.updateNSFWDisplaySettings.action(displayNSFWContent)),
  getCurrentUserSettings: () => dispatch(settingsActions.getCurrentUserSettings.action()),
  fetchReportedPosts: () => dispatch(settingsActions.fetchReportedPosts.action()),
  updateVotingSliderSetting: () => dispatch(settingsActions.updateVotingSliderSetting.action()),
});

class SettingsScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    displayNSFWContent: PropTypes.bool.isRequired,
    enableVotingSlider: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    getCurrentUserSettings: PropTypes.func.isRequired,
    updateNSFWDisplaySettings: PropTypes.func.isRequired,
    fetchReportedPosts: PropTypes.func.isRequired,
    updateVotingSliderSetting: PropTypes.func.isRequired,
    reportedPosts: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    reportedPosts: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      displayReportedPostsModal: false,
    };

    this.navigateBack = this.navigateBack.bind(this);
    this.handleUpdateNSFWDisplay = this.handleUpdateNSFWDisplay.bind(this);
    this.handleNavigatePost = this.handleNavigatePost.bind(this);
    this.handleNavigateUser = this.handleNavigateUser.bind(this);
    this.hideReportedPostsModal = this.hideReportedPostsModal.bind(this);
    this.showReportedPostsModal = this.showReportedPostsModal.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentUserSettings();
    this.props.fetchReportedPosts();
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  handleNavigatePost(author, permlink) {
    this.hideReportedPostsModal();
    this.props.navigation.navigate(navigationConstants.FETCH_POST, {
      author,
      permlink,
    });
  }

  hideReportedPostsModal() {
    this.setState({
      displayReportedPostsModal: false,
    });
  }

  showReportedPostsModal() {
    this.setState({
      displayReportedPostsModal: true,
    });
  }

  handleNavigateUser(username) {
    this.hideReportedPostsModal();
    this.props.navigation.navigate(navigationConstants.USER, { username });
  }

  handleUpdateNSFWDisplay() {
    const { displayNSFWContent } = this.props;
    this.props.updateNSFWDisplaySettings(!displayNSFWContent);
  }

  handleUpdateVotingSliderSetting() {
    const { enableVotingSlider } = this.props;
    this.props.updateVotingSliderSetting(!enableVotingSlider);
  }

  renderReportedPosts() {
    const { reportedPosts } = this.props;
    const reportedPostsPreview = _.map(reportedPosts, post => (
      <PostPreview
        key={post.id}
        handleNavigatePost={() => this.handleNavigatePost(post.author, post.permlink)}
        handleNavigateUser={() => this.handleNavigateUser(post.author)}
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
        <EmptyText>{i18n.saved.noReportedPosts}</EmptyText>
      </EmptyContent>
    ) : (
      reportedPostsPreview
    );
  }

  render() {
    const { displayNSFWContent, enableVotingSlider, authenticated } = this.props;
    const { displayReportedPostsModal } = this.state;
    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <TitleText>{i18n.titles.settings}</TitleText>
          <HeaderEmptyView />
        </Header>
        <CheckBox
          title={i18n.settings.enableNSFW}
          checked={displayNSFWContent}
          onPress={this.handleUpdateNSFWDisplay}
        />
        <ButtonContainer>
          <PrimaryButton
            title={i18n.settings.ViewReportedPosts}
            onPress={this.showReportedPostsModal}
          />
        </ButtonContainer>
        {authenticated && (
          <CheckBox
            title={i18n.settings.enableVotingSlider}
            checked={enableVotingSlider}
            onPress={this.handleUpdateVotingSliderSetting}
          />
        )}
        {displayReportedPostsModal && (
          <Modal
            animationType="slide"
            visible={displayReportedPostsModal}
            onRequestClose={this.hideReportedPostsModal}
          >
            <Header>
              <HeaderEmptyView />
              <TitleText>{i18n.titles.reportedPosts}</TitleText>
              <BackTouchable onPress={this.hideReportedPostsModal}>
                <MaterialIcons size={24} name={MATERIAL_ICONS.close} />
              </BackTouchable>
            </Header>
            <ScrollView>
              {this.renderReportedPosts()}
              <View style={{ height: 100 }} />
            </ScrollView>
          </Modal>
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
