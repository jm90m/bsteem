import React, { Component } from 'react';
import styled from 'styled-components/native';
import { TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import {
  getCompactViewEnabled,
  getCustomTheme,
  getLoadingUpdateCompactViewEnabled,
} from 'state/rootReducer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updatePostPreviewCompactModeSettings } from 'state/actions/settingsActions';
import { connect } from 'react-redux';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import SmallLoading from 'components/common/SmallLoading';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  height: 31.3px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  width: 100%;
`;

const FilterContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-top: 5px;
  padding-right: 10px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  width: 100%;
`;

class CompactViewFeedHeaderSetting extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    compactViewEnabled: PropTypes.bool.isRequired,
    loadingUpdateCompactViewEnabled: PropTypes.bool.isRequired,
    updatePostPreviewCompactModeSettings: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleSetCompactView = this.handleSetCompactView.bind(this);
  }

  handleSetCompactView() {
    const { compactViewEnabled } = this.props;
    this.props.updatePostPreviewCompactModeSettings(!compactViewEnabled);
  }

  render() {
    const { customTheme, compactViewEnabled, loadingUpdateCompactViewEnabled } = this.props;

    if (loadingUpdateCompactViewEnabled) {
      return (
        <Container customTheme={customTheme}>
          <SmallLoading />
        </Container>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={this.handleSetCompactView}>
        <FilterContainer customTheme={customTheme}>
          <MaterialCommunityIcons
            name={
              compactViewEnabled ? MATERIAL_COMMUNITY_ICONS.card : MATERIAL_COMMUNITY_ICONS.compact
            }
            size={ICON_SIZES.menuIcon}
            color={customTheme.primaryColor}
          />
        </FilterContainer>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  compactViewEnabled: getCompactViewEnabled(state),
  customTheme: getCustomTheme(state),
  loadingUpdateCompactViewEnabled: getLoadingUpdateCompactViewEnabled(state),
});

const mapDispatchToProps = dispatch => ({
  updatePostPreviewCompactModeSettings: compactViewEnabled =>
    dispatch(updatePostPreviewCompactModeSettings.action(compactViewEnabled)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompactViewFeedHeaderSetting);
