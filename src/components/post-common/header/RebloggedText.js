import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS, FONTS } from 'constants/styles';
import TouchableWithUserNavigation from 'components/navigation/TouchableWithUserNavigation';

const styles = StyleSheet.create({
  reblogged: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  reblogIcon: {
    marginRight: 5,
  },
});

class RebloggedText extends React.PureComponent {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    firstRebloggedBy: PropTypes.string,
    firstRebloggedOn: PropTypes.string,
  };

  static defaultProps = {
    firstRebloggedBy: '',
    firstRebloggedOn: '',
  };

  render() {
    const { customTheme, intl, firstRebloggedBy, firstRebloggedOn } = this.props;
    const reblogUserStyle = {
      fontFamily: FONTS.PRIMARY,
      color: customTheme.primaryColor,
    };
    const reblogTextStyle = {
      fontFamily: FONTS.PRIMARY,
      color: customTheme.tertiaryColor,
    };

    if (firstRebloggedBy) {
      return (
        <View style={styles.reblogged}>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.reblog}
            size={ICON_SIZES.contentTitleBlockIcon}
            color={customTheme.tertiaryColor}
            style={styles.reblogIcon}
          />
          <TouchableWithUserNavigation username={firstRebloggedBy}>
            <Text style={reblogUserStyle}>{firstRebloggedBy}</Text>
          </TouchableWithUserNavigation>
          <Text style={reblogTextStyle}>{` ${intl.reblogged}`}</Text>
        </View>
      );
    } else if (firstRebloggedOn) {
      return (
        <View style={styles.reblogged}>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.reblog}
            size={ICON_SIZES.contentTitleBlockIcon}
            color={customTheme.tertiaryColor}
            style={styles.reblogIcon}
          />
          <Text style={reblogTextStyle}>{intl.reblogged}</Text>
        </View>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(RebloggedText);
