import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import sc2 from 'api/sc2';
import { connect } from 'react-redux';
import _ from 'lodash';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES, MATERIAL_ICONS } from 'constants/styles';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import { FormLabel, FormInput } from 'react-native-elements';
import PrimaryButton from 'components/common/PrimaryButton';
import TitleText from 'components/common/TitleText';
import tinycolor from 'tinycolor2';
import Expo from 'expo';
import { getAuthUsername, getCustomTheme, getUsersDetails, getIntl } from '../../state/rootReducer';
import { fetchUser } from '../../state/actions/usersActions';

const Container = styled.View``;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 20px;
  justify-content: space-between;
  padding-bottom: 100px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled(TitleText)`
  margin-left: 3px;
`;

const StyledScrollView = styled.ScrollView`
  padding-bottom: 200px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const KeyboardIconContainer = styled.View`
  padding: 5px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  usersDetails: getUsersDetails(state),
  authUsername: getAuthUsername(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  fetchUser: username => dispatch(fetchUser.action({ username })),
});

class EditProfileScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    navigation: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    usersDetails: PropTypes.shape().isRequired,
    authUsername: PropTypes.string.isRequired,
    fetchUser: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const userDetails = _.get(props.usersDetails, props.authUsername, {});
    const userJsonMetaData = _.attempt(JSON.parse, userDetails.json_metadata);
    const userProfile = _.isError(userJsonMetaData) ? {} : _.get(userJsonMetaData, 'profile', {});
    const nameInput = _.get(userProfile, 'name', '');
    const aboutInput = _.get(userProfile, 'about', '');
    const locationInput = _.get(userProfile, 'location', '');
    const websiteInput = _.get(userProfile, 'website', '');
    const profilePictureInput = _.get(userProfile, 'profilePicture', '');
    const coverPictureInput = _.get(userProfile, 'cover_image', '');

    this.state = {
      nameInput,
      aboutInput,
      locationInput,
      websiteInput,
      profilePictureInput,
      coverPictureInput,
      keyboardDisplayed: false,
    };

    this.navigateBack = this.navigateBack.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeAbout = this.onChangeAbout.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeWebsite = this.onChangeWebsite.bind(this);
    this.onChangeProfilePicture = this.onChangeProfilePicture.bind(this);
    this.onChangeCoverPicture = this.onChangeCoverPicture.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.handleSetKeyboardDisplay(true),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.handleSetKeyboardDisplay(false),
    );
  }

  componentDidMount() {
    const { usersDetails, authUsername } = this.props;
    const userDetails = _.get(usersDetails, authUsername, {});

    if (_.isEmpty(userDetails)) {
      this.props.fetchUser(authUsername);
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldUserDetails = _.get(this.props.usersDetails, this.props.authUsername, {});
    const currentUserDetails = _.get(nextProps.usersDetails, nextProps.authUsername, {});
    const diffUserDetails = !_.isEqual(
      JSON.stringify(oldUserDetails),
      JSON.stringify(currentUserDetails),
    );

    if (diffUserDetails) {
      const userJsonMetaData = _.attempt(JSON.parse, currentUserDetails.json_metadata);
      const userProfile = _.isError(userJsonMetaData) ? {} : _.get(userJsonMetaData, 'profile', {});
      const nameInput = _.get(userProfile, 'name', '');
      const aboutInput = _.get(userProfile, 'about', '');
      const locationInput = _.get(userProfile, 'location', '');
      const websiteInput = _.get(userProfile, 'website', '');
      const profilePictureInput = _.get(userProfile, 'profilePicture', '');
      const coverPictureInput = _.get(userProfile, 'cover_image', '');

      this.setState({
        nameInput,
        aboutInput,
        locationInput,
        websiteInput,
        profilePictureInput,
        coverPictureInput,
      });
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onChangeName(value) {
    this.setState({
      nameInput: value,
    });
  }

  onChangeAbout(value) {
    this.setState({
      aboutInput: value,
    });
  }

  onChangeLocation(value) {
    this.setState({
      locationInput: value,
    });
  }

  onChangeWebsite(value) {
    this.setState({
      websiteInput: value,
    });
  }

  onChangeProfilePicture(value) {
    this.setState({
      profilePictureInput: value,
    });
  }
  onChangeCoverPicture(value) {
    this.setState({
      coverPictureInput: value,
    });
  }

  handleSetKeyboardDisplay = keyboardDisplayed => () => this.setState({ keyboardDisplayed });

  handleSubmit() {
    const userDetails = _.get(this.props.usersDetails, this.props.authUsername, {});
    const userJsonMetaData = _.attempt(JSON.parse, userDetails.json_metadata);
    const userProfile = _.isError(userJsonMetaData) ? {} : _.get(userJsonMetaData, 'profile', {});
    const nameInput = _.get(userProfile, 'name', '');
    const aboutInput = _.get(userProfile, 'about', '');
    const locationInput = _.get(userProfile, 'location', '');
    const websiteInput = _.get(userProfile, 'website', '');
    const profilePictureInput = _.get(userProfile, 'profilePicture', '');
    const coverPictureInput = _.get(userProfile, 'cover_image', '');
    const newProfileValues = {};

    if (!_.isEqual(nameInput, this.state.nameInput)) {
      newProfileValues.name = this.state.nameInput;
    }

    if (!_.isEqual(aboutInput, this.state.aboutInput)) {
      newProfileValues.about = this.state.aboutInput;
    }
    if (!_.isEqual(locationInput, this.state.locationInput)) {
      newProfileValues.location = this.state.locationInput;
    }
    if (!_.isEqual(websiteInput, this.state.websiteInput)) {
      newProfileValues.website = this.state.websiteInput;
    }
    if (!_.isEqual(profilePictureInput, this.state.profilePictureInput)) {
      newProfileValues.profilePicture = this.state.profilePictureInput;
    }
    if (!_.isEqual(coverPictureInput, this.state.coverPictureInput)) {
      newProfileValues.coverPicture = this.state.coverPictureInput;
    }

    const sc2URL = sc2.sign('profile-update', newProfileValues);

    Expo.WebBrowser.openBrowserAsync(sc2URL)
      .then(() => {
        _.delay(() => this.props.fetchUser(this.props.authUsername), 5000);
      })
      .catch(error => {
        console.log('invalid url', error, sc2URL);
      });
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { customTheme, intl } = this.props;
    const {
      nameInput,
      aboutInput,
      locationInput,
      websiteInput,
      profilePictureInput,
      coverPictureInput,
      editProfileLoading,
      keyboardDisplayed,
    } = this.state;
    const color = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.accountEdit}
              color={customTheme.primaryColor}
            />
            <Title>{intl.edit_profile}</Title>
          </TitleContainer>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardIconContainer>
              <MaterialIcons
                name={MATERIAL_ICONS.keyboardHide}
                color={keyboardDisplayed ? customTheme.primaryColor : 'transparent'}
                size={ICON_SIZES.menuIcon}
              />
            </KeyboardIconContainer>
          </TouchableWithoutFeedback>
        </Header>
        <StyledScrollView customTheme={customTheme}>
          <KeyboardAvoidingView behavior="padding">
            <FormLabel>{intl.profile_name}</FormLabel>
            <FormInput
              onChangeText={this.onChangeName}
              placeholder=""
              value={nameInput}
              maxLength={255}
              inputStyle={{ width: '100%', color }}
            />
            <FormLabel>{intl.profile_about}</FormLabel>
            <FormInput
              onChangeText={this.onChangeAbout}
              placeholder=""
              value={aboutInput}
              multiline
              inputStyle={{ width: '100%', color }}
            />
            <FormLabel>{intl.profile_location}</FormLabel>
            <FormInput
              onChangeText={this.onChangeLocation}
              placeholder=""
              value={locationInput}
              inputStyle={{ width: '100%', color }}
            />
            <FormLabel>{intl.profile_website}</FormLabel>
            <FormInput
              onChangeText={this.onChangeWebsite}
              placeholder=""
              value={websiteInput}
              inputStyle={{ width: '100%', color }}
            />
            <FormLabel>{intl.profile_picture}</FormLabel>
            <FormInput
              onChangeText={this.onChangeProfilePicture}
              placeholder=""
              value={profilePictureInput}
              inputStyle={{ width: '100%', color }}
            />
            <FormLabel>{intl.profile_cover}</FormLabel>
            <FormInput
              onChangeText={this.onChangeCoverPicture}
              placeholder=""
              value={coverPictureInput}
              inputStyle={{ width: '100%', color }}
            />
            <ActionButtonsContainer>
              <PrimaryButton
                onPress={this.handleSubmit}
                title={intl.submit}
                disabled={editProfileLoading}
                loading={editProfileLoading}
              />
            </ActionButtonsContainer>
          </KeyboardAvoidingView>
        </StyledScrollView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
