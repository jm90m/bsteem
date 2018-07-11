import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const styles = StyleSheet.create({
  notification: {
    padding: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    width: '100%'
  },
});

const NotificationContainer = ({ customTheme, children }) => (
  <View
    style={[
      styles.notification,
      {
        backgroundColor: customTheme.primaryBackgroundColor,
        borderBottomColor: customTheme.primaryBorderColor,
      },
    ]}
  >
    {children}
  </View>
);

NotificationContainer.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  children: PropTypes.node,
};

NotificationContainer.defaultProps = {
  children: null,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(NotificationContainer);
