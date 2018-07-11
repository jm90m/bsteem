import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { getCompactViewEnabled, getCustomTheme } from 'state/rootReducer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updatePostPreviewCompactModeSettings } from 'state/actions/settingsActions';
import { connect } from 'react-redux';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 5,
    paddingRight: 10,
    borderBottomWidth: 1,
    width: '100%',
  },
  filter: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

class CompactViewFeedHeaderSetting extends React.PureComponent {
  static propTypes = {
    updatePostPreviewCompactModeSettings: PropTypes.func.isRequired,
    customTheme: PropTypes.shape().isRequired,
    compactViewEnabled: PropTypes.bool.isRequired,
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
    const { customTheme, compactViewEnabled } = this.props;
    const containerStyles = {
      backgroundColor: customTheme.primaryBackgroundColor,
      borderBottomColor: customTheme.primaryBorderColor,
    };

    return (
      <View style={[styles.container, containerStyles]}>
        <TouchableWithoutFeedback onPress={this.handleSetCompactView}>
          <View style={styles.filter}>
            <MaterialCommunityIcons
              name={
                compactViewEnabled
                  ? MATERIAL_COMMUNITY_ICONS.card
                  : MATERIAL_COMMUNITY_ICONS.compact
              }
              size={ICON_SIZES.menuIcon}
              color={customTheme.primaryColor}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  compactViewEnabled: getCompactViewEnabled(state),
  customTheme: getCustomTheme(state),
});

const mapDispatchToProps = dispatch => ({
  updatePostPreviewCompactModeSettings: compactViewEnabled =>
    dispatch(updatePostPreviewCompactModeSettings.action(compactViewEnabled)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompactViewFeedHeaderSetting);
