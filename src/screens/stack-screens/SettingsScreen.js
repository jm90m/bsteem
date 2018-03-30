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
import { CheckBox, ButtonGroup } from 'react-native-elements';
import {
  getDisplayNSFWContent,
  getReportedPosts,
  getEnableVotingSlider,
  getIsAuthenticated,
  getVotingPercent,
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
  background-color: ${COLORS.PRIMARY_BACKGROUND_COLOR};
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
  flex-direction: row;
`;

const ScrollView = styled.ScrollView``;

const Slider = styled.Slider``;

const SettingContainer = styled.View``;

const SettingDescription = styled.Text`
  color: ${COLORS.TERTIARY_COLOR};
  padding: 0 20px;
`;

const SettingTitle = styled.Text`
  color: ${COLORS.SECONDARY_COLOR};
  font-weight: bold;
  padding: 15px 20px;
`;

const SettingValue = styled.Text`'
  color: ${COLORS.PRIMARY_COLOR};
`;

const mapStateToProps = state => ({
  authenticated: getIsAuthenticated(state),
  displayNSFWContent: getDisplayNSFWContent(state),
  reportedPosts: getReportedPosts(state),
  enableVotingSlider: getEnableVotingSlider(state),
  votingPercent: getVotingPercent(state),
});

const mapDispatchToProps = dispatch => ({
  updateNSFWDisplaySettings: displayNSFWContent =>
    dispatch(settingsActions.updateNSFWDisplaySettings.action(displayNSFWContent)),
  getCurrentUserSettings: () => dispatch(settingsActions.getCurrentUserSettings.action()),
  fetchReportedPosts: () => dispatch(settingsActions.fetchReportedPosts.action()),
  updateVotingSliderSetting: enableVotingSlider =>
    dispatch(settingsActions.updateVotingSliderSetting.action({ enableVotingSlider })),
  updateVotingPercentSetting: votingPercent =>
    dispatch(settingsActions.updateVotingPercentSetting.action({ votingPercent })),
});

class SettingsScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  static VOTING_PERCENT_BUTTONS = ['1%', '25%', '50%', '75%', '100%'];

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    displayNSFWContent: PropTypes.bool.isRequired,
    enableVotingSlider: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    getCurrentUserSettings: PropTypes.func.isRequired,
    updateNSFWDisplaySettings: PropTypes.func.isRequired,
    fetchReportedPosts: PropTypes.func.isRequired,
    updateVotingSliderSetting: PropTypes.func.isRequired,
    updateVotingPercentSetting: PropTypes.func.isRequired,
    reportedPosts: PropTypes.arrayOf(PropTypes.shape()),
    votingPercent: PropTypes.number.isRequired,
  };

  static defaultProps = {
    reportedPosts: [],
  };

  constructor(props) {
    super(props);
    const buttonVotingPercentIndex = _.findIndex(SettingsScreen.VOTING_PERCENT_BUTTONS, percent =>
      _.isEqual(parseFloat(percent), props.votingPercent),
    );
    this.state = {
      displayReportedPostsModal: false,
      votingSliderValue: props.votingPercent,
      initialVotingSliderValue: props.votingPercent,
      buttonVotingPercentIndex,
    };

    this.navigateBack = this.navigateBack.bind(this);
    this.handleUpdateNSFWDisplay = this.handleUpdateNSFWDisplay.bind(this);
    this.handleNavigatePost = this.handleNavigatePost.bind(this);
    this.handleNavigateUser = this.handleNavigateUser.bind(this);
    this.hideReportedPostsModal = this.hideReportedPostsModal.bind(this);
    this.showReportedPostsModal = this.showReportedPostsModal.bind(this);
    this.handleOnVotingSliderValue = this.handleOnVotingSliderValue.bind(this);
    this.handleUpdateVotingSliderSetting = this.handleUpdateVotingSliderSetting.bind(this);
    this.handleOnVotingPercentButtonPress = this.handleOnVotingPercentButtonPress.bind(this);
    this.handleOnVotingSliderValueComplete = this.handleOnVotingSliderValueComplete.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentUserSettings();
    this.props.fetchReportedPosts();
  }

  componentWillUnmount() {
    this.props.updateVotingPercentSetting(this.state.votingSliderValue);
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

  handleOnVotingSliderValue(votingSliderValue) {
    const buttonVotingPercentIndex = _.findIndex(SettingsScreen.VOTING_PERCENT_BUTTONS, percent =>
      _.isEqual(parseFloat(percent), votingSliderValue),
    );
    this.setState({
      votingSliderValue,
      buttonVotingPercentIndex,
    });
  }

  handleOnVotingSliderValueComplete(votingSliderValue) {
    this.props.updateVotingPercentSetting(votingSliderValue);
  }

  handleOnVotingPercentButtonPress(index) {
    const votePercent = parseFloat(_.get(SettingsScreen.VOTING_PERCENT_BUTTONS, index, '1'));
    this.setState({
      votingSliderValue: votePercent,
      initialVotingSliderValue: votePercent,
      buttonVotingPercentIndex: index,
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
    const {
      displayReportedPostsModal,
      votingSliderValue,
      initialVotingSliderValue,
      buttonVotingPercentIndex,
    } = this.state;
    const selectedButtonStyle = { backgroundColor: COLORS.PRIMARY_COLOR };
    const selectedTextStyle = { color: COLORS.PRIMARY_COLOR };

    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <TitleText>{i18n.titles.settings}</TitleText>
          <HeaderEmptyView />
        </Header>
        <ScrollView>
          <SettingContainer>
            <SettingTitle>{i18n.settings.nsfwPosts}</SettingTitle>
            <CheckBox
              title={i18n.settings.enableNSFW}
              checked={displayNSFWContent}
              onPress={this.handleUpdateNSFWDisplay}
            />
          </SettingContainer>

          {authenticated && (
            <SettingContainer>
              <SettingTitle>{i18n.settings.votingPower}</SettingTitle>
              <SettingDescription>{i18n.settings.votingPowerDescription}</SettingDescription>
              <CheckBox
                title={i18n.settings.enableVotingSlider}
                checked={enableVotingSlider}
                onPress={this.handleUpdateVotingSliderSetting}
              />
            </SettingContainer>
          )}
          {authenticated && (
            <SettingContainer>
              <SettingTitle>
                {`${i18n.settings.defaultVotePercent} - `}
                <SettingValue>{`${votingSliderValue}%`}</SettingValue>
              </SettingTitle>
              <SettingDescription>{i18n.settings.votingPercentDescription}</SettingDescription>
              <Slider
                minimumValue={1}
                step={1}
                maximumValue={100}
                onSlidingComplete={this.handleOnVotingSliderValueComplete}
                onValueChange={this.handleOnVotingSliderValue}
                value={initialVotingSliderValue}
              />
              <ButtonGroup
                onPress={this.handleOnVotingPercentButtonPress}
                selectedIndex={buttonVotingPercentIndex}
                buttons={SettingsScreen.VOTING_PERCENT_BUTTONS}
                containerStyle={{ height: 50 }}
                selectedButtonStyle={selectedButtonStyle}
                selectedTextStyle={selectedTextStyle}
              />
            </SettingContainer>
          )}
          <SettingContainer>
            <SettingTitle>{i18n.settings.reportedPosts}</SettingTitle>
            <ButtonContainer>
              <PrimaryButton
                title={i18n.settings.ViewReportedPosts}
                onPress={this.showReportedPostsModal}
              />
            </ButtonContainer>
          </SettingContainer>
        </ScrollView>
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
