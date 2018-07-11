import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES, COLORS, FONTS } from 'constants/styles';
import _ from 'lodash';
import { Picker, ScrollView, Slider, View } from 'react-native';
import { connect } from 'react-redux';
import Header from 'components/common/Header';
import { CheckBox, ButtonGroup } from 'react-native-elements';
import {
  getDisplayNSFWContent,
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
import * as navigationConstants from 'constants/navigation';
import tinycolor from 'tinycolor2';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import TitleText from 'components/common/TitleText';
import BackButton from 'components/common/BackButton';
import SmallLoading from 'components/common/SmallLoading';
import PrimaryText from 'components/common/text/PrimaryText';

let ReportedPostsModal = null;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
`;

const ButtonContainer = styled.View`
  margin: 10px 0;
  flex-direction: row;
`;

const SettingDescription = styled(PrimaryText)`
  color: ${props => props.customTheme.tertiaryColor};
  padding: 0 20px;
`;

const LoadingCheckboxContainer = styled.View`
  height: 56px;
  align-items: center;
  justify-content: center;
`;

const SettingTitle = styled(PrimaryText)`
  color: ${props => props.customTheme.secondaryColor};
  padding: 15px 20px;
`;

const SettingValue = styled(PrimaryText)`
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
    votingPercent: PropTypes.number.isRequired,
    loadingUpdateCompactViewEnabled: PropTypes.bool.isRequired,
    loadingUpdateNSFWDisplaySetting: PropTypes.bool.isRequired,
    loadingUpdateVotingSliderSetting: PropTypes.bool.isRequired,
    languageSetting: PropTypes.string.isRequired,
    updateUserLanguageSetting: PropTypes.func.isRequired,
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
    this.props.navigation.push(navigationConstants.POST, {
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
    if (ReportedPostsModal === null) {
      ReportedPostsModal = require('components/settings/ReportedPostsModal').default;
    }

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
    this.props.navigation.push(navigationConstants.USER, { username });
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
          <View>
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
          </View>

          <View>
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
          </View>

          {authenticated && (
            <View>
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
            </View>
          )}
          {authenticated && (
            <View>
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
            </View>
          )}
          <View>
            <SettingTitle customTheme={customTheme}>{intl.reportedPosts}</SettingTitle>
            <ButtonContainer>
              <PrimaryButton
                title={intl.view_reported_posts}
                onPress={this.showReportedPostsModal}
              />
            </ButtonContainer>
          </View>
          <View>
            <SettingTitle customTheme={customTheme}>{intl.set_color_theme}</SettingTitle>
            <ButtonContainer>
              <PrimaryButton
                title={intl.customize_color_theme}
                onPress={this.navigateToCustomTheme}
              />
            </ButtonContainer>
          </View>

          <View>
            <SettingTitle customTheme={customTheme}>{intl.set_language}</SettingTitle>
            <PickerContainer>
              <Picker
                selectedValue={languageSetting}
                onValueChange={this.onChangeLanguage}
                itemStyle={{ color: inputTextColor, fontFamily: FONTS.PRIMARY }}
              >
                {_.map(LANGUAGE_CHOICES, (label, key) => (
                  <Picker.Item label={label} value={key} key={key} />
                ))}
              </Picker>
            </PickerContainer>
          </View>
          <EmptyView />
        </ScrollView>
        {displayReportedPostsModal && (
          <ReportedPostsModal
            displayReportedPostsModal={displayReportedPostsModal}
            handleNavigatePost={this.handleNavigatePost}
            handleNavigateUser={this.handleNavigateUser}
            hideReportedPostsModal={this.hideReportedPostsModal}
          />
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
