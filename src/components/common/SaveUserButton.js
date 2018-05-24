import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from '../../constants/styles';
import { saveUser, unsaveUser } from '../../state/actions/firebaseActions';
import { getPendingSavingUsers, getSavedUsers, getCustomTheme } from '../../state/rootReducer';
import SmallLoading from './SmallLoading';

const Touchable = styled.TouchableOpacity``;

@connect(
  state => ({
    pendingSavingUsers: getPendingSavingUsers(state),
    savedUsers: getSavedUsers(state),
    customTheme: getCustomTheme(state),
  }),
  dispatch => ({
    saveUser: username => dispatch(saveUser.action({ username })),
    unsaveUser: username => dispatch(unsaveUser.action({ username })),
  }),
)
class SaveUserButton extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    saveUser: PropTypes.func.isRequired,
    unsaveUser: PropTypes.func.isRequired,
    customTheme: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.handleSaveUser = this.handleSaveUser.bind(this);
    this.handleUnsaveUser = this.handleUnsaveUser.bind(this);
  }

  handleSaveUser() {
    const { username } = this.props;
    this.props.saveUser(username);
  }

  handleUnsaveUser() {
    const { username } = this.props;
    this.props.unsaveUser(username);
  }

  render() {
    const { username, savedUsers, pendingSavingUsers, customTheme } = this.props;

    if (_.includes(pendingSavingUsers, username)) {
      return <SmallLoading style={{ marginLeft: 5 }} />;
    }

    const isSaved = _.includes(savedUsers, username);

    return isSaved ? (
      <Touchable onPress={this.handleUnsaveUser}>
        <MaterialCommunityIcons
          name={MATERIAL_COMMUNITY_ICONS.saved}
          size={ICON_SIZES.menuIcon}
          color={customTheme.primaryColor}
        />
      </Touchable>
    ) : (
      <Touchable onPress={this.handleSaveUser}>
        <MaterialCommunityIcons
          name={MATERIAL_COMMUNITY_ICONS.save}
          size={ICON_SIZES.menuIcon}
          color={customTheme.primaryColor}
        />
      </Touchable>
    );
  }
}

export default SaveUserButton;
