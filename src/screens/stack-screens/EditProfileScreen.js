import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import sc2 from 'api/sc2';
import { connect } from 'react-redux';
import _ from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import i18n from 'i18n/i18n';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import { FormLabel, FormInput } from 'react-native-elements';
import PrimaryButton from 'components/common/PrimaryButton';
import Expo from 'expo';
import { getAuthUsername, getUsersDetails } from '../../state/rootReducer';
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

const Title = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  margin-left: 3px;
`;

const StyledScrollView = styled.ScrollView`
  padding-bottom: 200px;
  background-color: ${COLORS.WHITE.WHITE};
`;

const mapStateToProps = state => ({
  usersDetails: getUsersDetails(state),
  authUsername: getAuthUsername(state),
});

const mapDispatchToProps = dispatch => ({
  fetchUser: username => dispatch(fetchUser.action({ username })),
});

class EditProfileScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
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
    const {
      nameInput,
      aboutInput,
      locationInput,
      websiteInput,
      profilePictureInput,
      coverPictureInput,
      editProfileLoading,
    } = this.state;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.accountEdit}
              color={COLORS.PRIMARY_COLOR}
            />
            <Title>{i18n.titles.editProfile}</Title>
          </TitleContainer>
          <HeaderEmptyView />
        </Header>
        <StyledScrollView>
          <FormLabel>{i18n.editProfile.name}</FormLabel>
          <FormInput
            onChangeText={this.onChangeName}
            placeholder=""
            value={nameInput}
            maxLength={255}
            inputStyle={{ width: '100%' }}
          />
          <FormLabel>{i18n.editProfile.about}</FormLabel>
          <FormInput
            onChangeText={this.onChangeAbout}
            placeholder=""
            value={aboutInput}
            multiline
            inputStyle={{ width: '100%' }}
          />
          <FormLabel>{i18n.editProfile.location}</FormLabel>
          <FormInput onChangeText={this.onChangeLocation} placeholder="" value={locationInput} />
          <FormLabel>{i18n.editProfile.website}</FormLabel>
          <FormInput onChangeText={this.onChangeWebsite} placeholder="" value={websiteInput} />
          <FormLabel>{i18n.editProfile.profilePicture}</FormLabel>
          <FormInput
            onChangeText={this.onChangeProfilePicture}
            placeholder=""
            value={profilePictureInput}
            inputStyle={{ width: '100%' }}
          />
          <FormLabel>{i18n.editProfile.coverPicture}</FormLabel>
          <FormInput
            onChangeText={this.onChangeCoverPicture}
            placeholder=""
            value={coverPictureInput}
            inputStyle={{ width: '100%' }}
          />
          <ActionButtonsContainer>
            <PrimaryButton
              onPress={this.handleSubmit}
              title={i18n.editProfile.submit}
              disabled={editProfileLoading}
              loading={editProfileLoading}
            />
          </ActionButtonsContainer>
        </StyledScrollView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
