import React, { Component } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {
  COLORS,
  ICON_SIZES,
  MATERIAL_COMMUNITY_ICONS,
  MATERIAL_ICONS,
  bSteemColors,
  dTubeColors,
  busyColors,
  steemitColors,
  bSteemDarkColors,
  steemitDarkColors,
} from 'constants/styles';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import { updateCustomTheme } from 'state/actions/settingsActions';
import BackButton from 'components/common/BackButton';
import tinycolor from 'tinycolor2';
import Header from 'components/common/Header';
import TitleText from 'components/common/TitleText';

let SliderColorPicker = null;

const Container = styled.View`
  flex: 1;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const KeyboardIconContainer = styled.View`
  padding: 5px;
`;

const styles = StyleSheet.create({
  content: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  sectionText: {
    marginTop: 32,
    color: '#222',
    fontSize: 22,
    lineHeight: 28,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
      },
      ios: {
        fontWeight: '600',
        letterSpacing: 0.75,
      },
    }),
  },
  descriptionText: {
    fontSize: 14,
  },
  colorPreview: {
    marginLeft: 12,
    marginTop: 12,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 3,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.25,
    width: 225,
  },
  colorString: {
    fontSize: 34,
    lineHeight: 41,
    ...Platform.select({
      android: {
        fontFamily: 'monospace',
      },
      ios: {
        fontFamily: 'Courier New',
        fontWeight: '600',
        letterSpacing: 0.75,
      },
    }),
  },
});

const COLOR_SETTINGS = {
  primaryColor: 'primaryColor',
  secondaryColor: 'secondaryColor',
  tertiaryColor: 'tertiaryColor',
  listBackgroundColor: 'listBackgroundColor',
  primaryBackgroundColor: 'primaryBackgroundColor',
  primaryBorderColor: 'primaryBorderColor',
  positiveColor: 'positiveColor',
  negativeColor: 'negativeColor',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  updateCustomTheme: customTheme => dispatch(updateCustomTheme.action(customTheme)),
});

class CustomThemeScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    updateCustomTheme: PropTypes.func.isRequired,
    customTheme: PropTypes.shape({
      primaryColor: PropTypes.string.isRequired,
      secondaryColor: PropTypes.string.isRequired,
      tertiaryColor: PropTypes.string.isRequired,
      listBackgroundColor: PropTypes.string.isRequired,
      primaryBackgroundColor: PropTypes.string.isRequired,
      primaryBorderColor: PropTypes.string.isRequired,
      positiveColor: PropTypes.string.isRequired,
      negativeColor: PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    const colorSettings = _.reduce(
      COLOR_SETTINGS,
      (updatedColorSettings, key) => {
        const recentColorSettingStateKey = `${key}Recents`;

        // eslint-disable-next-line
        updatedColorSettings[key] = tinycolor(props.customTheme[key]).toHsl();
        // eslint-disable-next-line
        updatedColorSettings[recentColorSettingStateKey] = [
          bSteemColors.primaryColor,
          bSteemDarkColors.primaryColor,
          dTubeColors.primaryColor,
          busyColors.primaryColor,
          steemitColors.primaryColor,
        ];
        return updatedColorSettings;
      },
      {},
    );

    this.state = {
      ...colorSettings,
      modalVisible: false,
      selectedColorSetting: COLOR_SETTINGS.primaryColor,
      keyboardDisplayed: false,
    };

    this.getColorPickerOkCallback = this.getColorPickerOkCallback.bind(this);
    this.getRecentsColor = this.getRecentsColor.bind(this);
    this.getCurrentColor = this.getCurrentColor.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const diffCustomTheme =
      JSON.stringify(this.props.customTheme) !== JSON.stringify(nextProps.customTheme);

    if (diffCustomTheme) {
      const colorSettings = _.reduce(
        COLOR_SETTINGS,
        (updatedColorSettings, key) => {
          // eslint-disable-next-line
          updatedColorSettings[key] = tinycolor(nextProps.customTheme[key]).toHsl();
          return updatedColorSettings;
        },
        {},
      );
      this.setState(colorSettings);
    }
  }

  getColorPickerOkCallback() {
    const { selectedColorSetting } = this.state;

    return colorHex => {
      const { customTheme } = this.props;
      const recentColorSettingStateKey = `${selectedColorSetting}Recents`;
      this.setState({
        modalVisible: false,
        [recentColorSettingStateKey]: [
          colorHex,
          ...this.state[recentColorSettingStateKey].filter(c => c !== colorHex).slice(0, 4),
        ],
        [selectedColorSetting]: tinycolor(colorHex).toHsl(),
      });

      const newCustomTheme = {
        ...customTheme,
        [selectedColorSetting]: colorHex,
      };

      this.props.updateCustomTheme(newCustomTheme);
    };
  }

  getRecentsColor() {
    const { selectedColorSetting } = this.state;
    const recentColorSettingStateKey = `${selectedColorSetting}Recents`;
    const defaultRecentColorSettingsKey = `${COLOR_SETTINGS.primaryColor}Recents`;
    return _.get(this.state, recentColorSettingStateKey, this.state[defaultRecentColorSettingsKey]);
  }

  getCurrentColor() {
    const { selectedColorSetting } = this.state;
    return _.get(this.state, selectedColorSetting, this.state.primaryColor);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  handleSetTheme = theme => () => {
    this.props.updateCustomTheme(theme);
  };

  handleSetDisplayColorPickerModal = (
    modalVisible,
    selectedColorSetting = COLOR_SETTINGS.primaryColor,
  ) => () => {
    if (modalVisible && SliderColorPicker === null) {
      const { SlidersColorPicker } = require('react-native-color');
      SliderColorPicker = SlidersColorPicker;
    }
    this.setState(
      {
        selectedColorSetting,
      },
      () => this.setState({ modalVisible }),
    );
  };

  render() {
    const { customTheme, intl } = this.props;
    const { keyboardDisplayed, modalVisible } = this.state;
    const colorPickerOkCallback = this.getColorPickerOkCallback();
    const recentsColor = this.getRecentsColor();
    const currentColor = this.getCurrentColor();

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.autoFix}
              color={customTheme.primaryColor}
            />
            <TitleText style={{ marginLeft: 3 }}>{intl.custom_theme}</TitleText>
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
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.descriptionText, { paddingTop: 10 }]}>
            {intl.custom_theme_description}
          </Text>
          <ScrollView horizontal>
            <TouchableOpacity
              onPress={this.handleSetTheme(bSteemColors)}
              style={[
                styles.colorPreview,
                { backgroundColor: bSteemColors.primaryBackgroundColor },
              ]}
            >
              <Text style={[styles.colorString, { color: bSteemColors.primaryColor }]}>
                {'bSteem Theme'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleSetTheme(bSteemDarkColors)}
              style={[
                styles.colorPreview,
                { backgroundColor: bSteemDarkColors.primaryBackgroundColor },
              ]}
            >
              <Text style={[styles.colorString, { color: bSteemDarkColors.primaryColor }]}>
                {'bSteem Dark'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleSetTheme(dTubeColors)}
              style={[styles.colorPreview, { backgroundColor: dTubeColors.primaryBackgroundColor }]}
            >
              <Text style={[styles.colorString, { color: dTubeColors.primaryColor }]}>
                {'dTube Theme'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleSetTheme(busyColors)}
              style={[styles.colorPreview, { backgroundColor: busyColors.primaryBackgroundColor }]}
            >
              <Text style={[styles.colorString, { color: busyColors.primaryColor }]}>
                {'Busy Theme'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleSetTheme(steemitColors)}
              style={[
                styles.colorPreview,
                { backgroundColor: steemitColors.primaryBackgroundColor },
              ]}
            >
              <Text style={[styles.colorString, { color: steemitColors.primaryColor }]}>
                {'Steemit Theme'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleSetTheme(steemitDarkColors)}
              style={[
                styles.colorPreview,
                { backgroundColor: steemitDarkColors.primaryBackgroundColor },
              ]}
            >
              <Text style={[styles.colorString, { color: steemitDarkColors.primaryColor }]}>
                {'Steemit Dark'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
          {_.map(COLOR_SETTINGS, colorSetting => {
            const currentColorSetting = this.state[colorSetting];
            const overlayTextColor = tinycolor(currentColorSetting).isDark()
              ? COLORS.LIGHT_TEXT_COLOR
              : COLORS.DARK_TEXT_COLOR;

            return (
              <View key={colorSetting}>
                <Text style={styles.sectionText}>{intl[colorSetting]}</Text>
                <Text style={styles.descriptionText}>{intl[`${colorSetting}Description`]}</Text>
                <TouchableOpacity
                  onPress={this.handleSetDisplayColorPickerModal(true, colorSetting)}
                  style={[
                    styles.colorPreview,
                    { backgroundColor: tinycolor(currentColorSetting).toHslString() },
                  ]}
                >
                  <Text style={[styles.colorString, { color: overlayTextColor }]}>
                    {tinycolor(currentColorSetting).toHexString()}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
          {modalVisible && (
            <SliderColorPicker
              visible={modalVisible}
              color={tinycolor(currentColor).toHexString()}
              returnMode="hex"
              onCancel={this.handleSetDisplayColorPickerModal(false)}
              onOk={colorPickerOkCallback}
              swatches={recentsColor}
              swatchesLabel="RECENTS"
              okLabel="Done"
              cancelLabel="Cancel"
            />
          )}
        </ScrollView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomThemeScreen);
