import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import APPS from 'constants/apps';
import { FONTS } from 'constants/styles';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getCustomTheme } from 'state/rootReducer';
import TouchableWithBeneficiariesNavigation from 'components/navigation/TouchableWithBeneficiariesNavigation';
import commonStyles from 'styles/common';

const styles = StyleSheet.create({
  postedFrom: {
    fontSize: 14,
    fontFamily: FONTS.PRIMARY,
  },
  seperator: {
    marginHorizontal: 5,
  },
});

class PostedFrom extends React.PureComponent {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    displaySeperator: PropTypes.bool,
    jsonMetadata: PropTypes.string,
    beneficiaries: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    displaySeperator: false,
    jsonMetadata: '{}',
    beneficiaries: [],
  };

  render() {
    try {
      const { customTheme, jsonMetadata, beneficiaries, displaySeperator } = this.props;
      const parsedJsonMetadata = _.attempt(JSON.parse, jsonMetadata);
      const app = _.isError(parsedJsonMetadata) ? [] : _.split(parsedJsonMetadata.app, '/');
      const from = _.get(APPS, _.get(app, 0, ''), '');
      const hasBeneficiaries = !_.isEmpty(beneficiaries);
      const postedFromStyles = {
        color: hasBeneficiaries ? customTheme.negativeColor : customTheme.tertiaryColor,
      };
      const seperatorStyles = {
        color: customTheme.tertiaryColor,
      };

      if (_.isEmpty(from)) {
        return <View />;
      }

      return (
        <View style={commonStyles.rowContainer}>
          {displaySeperator && (
            <View style={styles.seperator}>
              <Text style={[commonStyles.primaryText, seperatorStyles]}>•</Text>
            </View>
          )}
          {hasBeneficiaries ? (
            <TouchableWithBeneficiariesNavigation beneficiaries={beneficiaries}>
              <Text style={[styles.postedFrom, postedFromStyles]}>{from}</Text>
            </TouchableWithBeneficiariesNavigation>
          ) : (
            <Text style={[styles.postedFrom, postedFromStyles]}>{from}</Text>
          )}
        </View>
      );
    } catch (e) {
      return <View />;
    }
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(PostedFrom);
