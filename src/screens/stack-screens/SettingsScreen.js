import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES, COLORS } from 'constants/styles';
import _ from 'lodash';
import { Modal, Picker } from 'react-native';
import { connect } from 'react-redux';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import { CheckBox, ButtonGroup } from 'react-native-elements';
import {
  getDisplayNSFWContent,
  getReportedPosts,
  getEnableVotingSlider,
  getIsAuthenticated,
  getVotingPercent,
  getCustomTheme,
  getCompactViewEnabled,
  getLoadingUpdateCompactViewEnabled,
  getLoadingUpdateNSFWDisplaySetting,
  getLoadingUpdateVotingSliderSetting,
  getLanguageSetting,
  getIntl,
} from 'state/rootReducer';
import { LANGUAGE_CHOICES } from 'state/reducers/intlReducer';
import * as settingsActions from 'state/actions/settingsActions';
import PrimaryButton from 'components/common/PrimaryButton';
import PostPreview from 'components/saved-content/PostPreview';
import * as navigationConstants from 'constants/navigation';
import tinycolor from 'tinycolor2';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import TitleText from 'components/common/TitleText';
import ReportPostButton from 'components/common/ReportPostButton';
import BackButton from 'components/common/BackButton';
import SmallLoading from 'components/common/SmallLoading';

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const EmptyContent = styled(StyledViewPrimaryBackground)`
  padding: 20px;
`;

const EmptyText = styled(StyledTextByBackground)`
  font-size: 18px;
`;

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
`;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const ButtonContainer = styled.View`
  margin: 10px 0;
  flex-direction: row;
`;

const ScrollView = styled.ScrollView``;

const Slider = styled.Slider``;

const SettingContainer = styled.View``;

const SettingDescription = styled.Text`
  color: ${props => props.customTheme.tertiaryColor};
  padding: 0 20px;
`;

const LoadingCheckboxContainer = styled.View`
  height: 56px;
  align-items: center;
  justify-content: center;
`;

const SettingTitle = styled.Text`
  color: ${props => props.customTheme.secondaryColor};
  font-weight: bold;
  padding: 15px 20px;
`;

const SettingValue = styled.Text`'
  color: ${props => props.customTheme.primaryColor};
`;

const EmptyView = styled.View`
  width: 100px;
  height: 300px;
`;

const PickerContainer = styled.View`
  padding: 0 10px;
`;

const mapStateToProps = state => ({
  intl: getIntl(state),
  customTheme: getCustomTheme(state),
  languageSetting: getLanguageSetting(state),
  authenticated: getIsAuthenticated(state),
  displayNSFWContent: getDisplayNSFWContent(state),
  compactViewEnabled: getCompactViewEnabled(state),
  reportedPosts: getReportedPosts(state),
  enableVotingSlider: getEnableVotingSlider(state),
  votingPercent: getVotingPercent(state),
  loadingUpdateCompactViewEnabled: getLoadingUpdateCompactViewEnabled(state),
  loadingUpdateNSFWDisplaySetting: getLoadingUpdateNSFWDisplaySetting(state),
  loadingUpdateVotingSliderSetting: getLoadingUpdateVotingSliderSetting(state),
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
  updatePostPreviewCompactModeSettings: compactViewEnabled =>
    dispatch(settingsActions.updatePostPreviewCompactModeSettings.action(compactViewEnabled)),
  updateUserLanguageSetting: languageSetting =>
    dispatch(settingsActions.updateUserLanguageSetting.action(languageSetting)),
});

class SettingsScreen extends Component {
  static VOTING_PERCENT_BUTTONS = ['1%', '25%', '50%', '75%', '100%'];

  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    intl: PropTypes.shape().isRequired,
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    displayNSFWContent: PropTypes.bool.isRequired,
    enableVotingSlider: PropTypes.bool.isRequired,
    compactViewEnabled: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    getCurrentUserSettings: PropTypes.func.isRequired,
    updateNSFWDisplaySettings: PropTypes.func.isRequired,
    fetchReportedPosts: PropTypes.func.isRequired,
    updateVotingSliderSetting: PropTypes.func.isRequired,
    updateVotingPercentSetting: PropTypes.func.isRequired,
    updatePostPreviewCompactModeSettings: PropTypes.func.isRequired,
    reportedPosts: PropTypes.arrayOf(PropTypes.shape()),
    votingPercent: PropTypes.number.isRequired,
    loadingUpdateCompactViewEnabled: PropTypes.bool.isRequired,
    loadingUpdateNSFWDisplaySetting: PropTypes.bool.isRequired,
    loadingUpdateVotingSliderSetting: PropTypes.bool.isRequired,
    languageSetting: PropTypes.string.isRequired,
    updateUserLanguageSetting: PropTypes.func.isRequired,
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
      languageSetting: props.languageSetting,
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
    this.navigateToCustomTheme = this.navigateToCustomTheme.bind(this);
    this.handleUpdatePostPreviewCompactView = this.handleUpdatePostPreviewCompactView.bind(this);
    this.onChangeLanguage = this.onChangeLanguage.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentUserSettings();
    this.props.fetchReportedPosts();
  }

  componentWillUnmount() {
    this.props.updateVotingPercentSetting(this.state.votingSliderValue);
  }

  onChangeLanguage(languageSetting) {
    this.setState({
      languageSetting,
    });
    this.props.updateUserLanguageSetting(languageSetting);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  navigateToCustomTheme() {
    this.props.navigation.navigate(navigationConstants.CUSTOM_THEME);
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

  handleUpdatePostPreviewCompactView() {
    const { compactViewEnabled } = this.props;
    this.props.updatePostPreviewCompactModeSettings(!compactViewEnabled);
  }

  handleUpdateVotingSliderSetting() {
    const { enableVotingSlider } = this.props;
    this.props.updateVotingSliderSetting(!enableVotingSlider);
  }

  renderReportedPosts() {
    const { reportedPosts, intl } = this.props;
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
        <EmptyText>{intl.noReportedPosts}</EmptyText>
      </EmptyContent>
    ) : (
      reportedPostsPreview
    );
  }

  render() {
    const {
      displayNSFWContent,
      enableVotingSlider,
      authenticated,
      customTheme,
      compactViewEnabled,
      loadingUpdateCompactViewEnabled,
      loadingUpdateNSFWDisplaySetting,
      loadingUpdateVotingSliderSetting,
      intl,
    } = this.props;
    const {
      displayReportedPostsModal,
      votingSliderValue,
      initialVotingSliderValue,
      buttonVotingPercentIndex,
      languageSetting,
    } = this.state;
    const selectedButtonStyle = { backgroundColor: customTheme.primaryColor };
    const selectedTextStyle = { color: customTheme.primaryColor };
    const inputTextColor = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleText>{intl.settings}</TitleText>
          <MenuIconContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.menuVertical}
              color="transparent"
            />
          </MenuIconContainer>
        </Header>
        <ScrollView>
          <SettingContainer>
            <SettingTitle customTheme={customTheme}>{intl.nsfw_posts}</SettingTitle>
            {loadingUpdateNSFWDisplaySetting ? (
              <LoadingCheckboxContainer>
                <SmallLoading />
              </LoadingCheckboxContainer>
            ) : (
              <CheckBox
                title={intl.enable_nsfw}
                checked={displayNSFWContent}
                onPress={this.handleUpdateNSFWDisplay}
              />
            )}
          </SettingContainer>

          <SettingContainer>
            <SettingTitle customTheme={customTheme}>{intl.post_preview_setting_title}</SettingTitle>
            {loadingUpdateCompactViewEnabled ? (
              <LoadingCheckboxContainer>
                <SmallLoading />
              </LoadingCheckboxContainer>
            ) : (
              <CheckBox
                title={intl.postPreviewCompactView}
                checked={compactViewEnabled}
                onPress={this.handleUpdatePostPreviewCompactView}
              />
            )}
          </SettingContainer>

          {authenticated && (
            <SettingContainer>
              <SettingTitle customTheme={customTheme}>{intl.voting_power}</SettingTitle>
              <SettingDescription customTheme={customTheme}>
                {intl.voting_power_description}
              </SettingDescription>
              {loadingUpdateVotingSliderSetting ? (
                <LoadingCheckboxContainer>
                  <SmallLoading />
                </LoadingCheckboxContainer>
              ) : (
                <CheckBox
                  title={intl.enableVotingSlider}
                  checked={enableVotingSlider}
                  onPress={this.handleUpdateVotingSliderSetting}
                />
              )}
            </SettingContainer>
          )}
          {authenticated && (
            <SettingContainer>
              <SettingTitle customTheme={customTheme}>
                {`${intl.defaultVotePercent} - `}
                <SettingValue customTheme={customTheme}>{`${votingSliderValue}%`}</SettingValue>
              </SettingTitle>
              <SettingDescription customTheme={customTheme}>
                {intl.votingPercentDescription}
              </SettingDescription>
              <Slider
                minimumValue={1}
                step={1}
                maximumValue={100}
                onSlidingComplete={this.handleOnVotingSliderValueComplete}
                onValueChange={this.handleOnVotingSliderValue}
                value={initialVotingSliderValue}
                minimumTrackTintColor={customTheme.primaryColor}
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
            <SettingTitle customTheme={customTheme}>{intl.reportedPosts}</SettingTitle>
            <ButtonContainer>
              <PrimaryButton
                title={intl.view_reported_posts}
                onPress={this.showReportedPostsModal}
              />
            </ButtonContainer>
          </SettingContainer>
          <SettingContainer>
            <SettingTitle customTheme={customTheme}>{intl.set_color_theme}</SettingTitle>
            <ButtonContainer>
              <PrimaryButton
                title={intl.customize_color_theme}
                onPress={this.navigateToCustomTheme}
              />
            </ButtonContainer>
          </SettingContainer>

          <SettingContainer>
            <SettingTitle customTheme={customTheme}>{intl.set_language}</SettingTitle>
            <PickerContainer>
              <Picker
                selectedValue={languageSetting}
                onValueChange={this.onChangeLanguage}
                itemStyle={{ color: inputTextColor }}
              >
                {_.map(LANGUAGE_CHOICES, (label, key) => (
                  <Picker.Item label={label} value={key} key={key} />
                ))}
              </Picker>
            </PickerContainer>
          </SettingContainer>
          <EmptyView />
        </ScrollView>
        {displayReportedPostsModal && (
          <Modal
            animationType="slide"
            visible={displayReportedPostsModal}
            onRequestClose={this.hideReportedPostsModal}
          >
            <Header>
              <HeaderEmptyView />
              <TitleText>{intl.reportedPosts}</TitleText>
              <BackTouchable onPress={this.hideReportedPostsModal}>
                <MaterialIcons
                  size={24}
                  name={MATERIAL_ICONS.close}
                  color={customTheme.primaryColor}
                />
              </BackTouchable>
            </Header>
            <ScrollView>
              {this.renderReportedPosts()}
              <EmptyView />
            </ScrollView>
          </Modal>
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
