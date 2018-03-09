import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import { connect } from 'react-redux';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import i18n from 'i18n/i18n';
import { CheckBox } from 'react-native-elements';
import { getDisplayNSFWContent } from 'state/rootReducer';
import * as settingsActions from 'state/actions/settingsActions';

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

const mapStateToProps = state => ({
  displayNSFWContent: getDisplayNSFWContent(state),
});

const mapDispatchToProps = dispatch => ({
  updateNSFWDisplaySettings: displayNSFWContent =>
    dispatch(settingsActions.updateNSFWDisplaySettings.action(displayNSFWContent)),
  getCurrentUserSettings: () => dispatch(settingsActions.getCurrentUserSettings.action()),
});

class SettingsScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    displayNSFWContent: PropTypes.bool.isRequired,
    getCurrentUserSettings: PropTypes.func.isRequired,
    updateNSFWDisplaySettings: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.navigateBack = this.navigateBack.bind(this);
    this.handleUpdateNSFWDisplay = this.handleUpdateNSFWDisplay.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentUserSettings();
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  handleUpdateNSFWDisplay() {
    const { displayNSFWContent } = this.props;
    this.props.updateNSFWDisplaySettings(!displayNSFWContent);
  }

  render() {
    const { displayNSFWContent } = this.props;
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
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
