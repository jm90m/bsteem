import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import Touchable from 'components/common/Touchable';
import * as navigationConstants from 'constants/navigation';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { jsonStringify } from '../../util/bsteemUtils';

class TouchableWithBeneficiariesNavigation extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    children: PropTypes.node,
    beneficiaries: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    children: null,
    beneficiaries: [],
  };

  constructor(props) {
    super(props);

    this.handleBeneficiariesNavigation = this.handleBeneficiariesNavigation.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const diffCustomTheme =
      jsonStringify(this.props.customTheme) !== jsonStringify(nextProps.customTheme);
    const diffBeneficiaries =
      jsonStringify(this.props.beneficiaries) !== jsonStringify(nextProps.beneficiaries);

    return diffCustomTheme || diffBeneficiaries;
  }

  handleBeneficiariesNavigation() {
    const { navigation, beneficiaries } = this.props;

    navigation.push(navigationConstants.POST_BENEFICIARIES, { beneficiaries });
  }

  render() {
    return (
      <Touchable onPress={this.handleBeneficiariesNavigation}>
        <View>{this.props.children}</View>
      </Touchable>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(withNavigation(TouchableWithBeneficiariesNavigation));
