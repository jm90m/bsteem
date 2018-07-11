import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { getIntl } from 'state/rootReducer';
import { connect } from 'react-redux';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';

const styles = StyleSheet.create({
  emptyContainer: {
    marginVertical: 5,
    padding: 20,
  },
});

const EmptyText = ({ intl }) => (
  <StyledViewPrimaryBackground style={styles.emptyContainer}>
    <StyledTextByBackground>{intl.empty_feed_check_filters}</StyledTextByBackground>
  </StyledViewPrimaryBackground>
);

EmptyText.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default connect(state => ({
  intl: getIntl(state),
}))(EmptyText);
