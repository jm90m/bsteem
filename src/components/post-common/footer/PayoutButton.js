import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import TouchableWithVotesNavigation from 'components/navigation/TouchableWithVotesNavigation';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getCustomTheme } from '../../../state/rootReducer';
import { calculatePayout } from '../../../util/steemitUtils';
import { jsonStringify } from '../../../util/bsteemUtils';

const styles = StyleSheet.create({
  payout: {
    marginLeft: 'auto',
    fontSize: 15,
    alignSelf: 'center',
    marginBottom: 3,
  },
});

class PayoutButton extends React.Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    postDetails: PropTypes.shape(),
  };

  static defaultProps = {
    postDetails: {},
  };

  shouldComponentUpdate(nextProps) {
    const diffCustomTheme = this.props.customTheme !== nextProps.customTheme;
    const diffPostDetails = !_.isEqual(
      jsonStringify(this.props.postDetails),
      jsonStringify(nextProps.postDetails),
    );

    return diffCustomTheme || diffPostDetails;
  }

  render() {
    const { postDetails, customTheme } = this.props;
    const payout = calculatePayout(postDetails);
    const displayedPayout = payout.cashoutInTime ? payout.potentialPayout : payout.pastPayouts;
    const formattedDisplayedPayout = _.isUndefined(displayedPayout)
      ? '0.00'
      : parseFloat(displayedPayout).toFixed(2);
    const payoutIsDeclined = _.get(payout, 'isPayoutDeclined', false);

    return (
      <TouchableWithVotesNavigation postDetails={postDetails}>
        <Text
          style={[
            styles.payout,
            {
              color: customTheme.tertiaryColor,
              textDecorationLine: payoutIsDeclined ? 'line-through' : 'none',
            },
          ]}
        >
          ${formattedDisplayedPayout}
        </Text>
      </TouchableWithVotesNavigation>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(PayoutButton);
