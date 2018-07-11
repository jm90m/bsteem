import React from 'react';
import PropTypes from 'prop-types';
import { TouchableNativeFeedback, TouchableOpacity, Platform } from 'react-native';

const Touchable = ({ circle, ...props }) => {
  if (Platform.OS === 'ios') return <TouchableOpacity {...props} />;

  if (circle) {
    return (
      <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#AAF', true)} {...props}>
        {props.children}
      </TouchableNativeFeedback>
    );
  }

  return <TouchableNativeFeedback {...props}>{props.children}</TouchableNativeFeedback>;
};

Touchable.propTypes = {
  circle: PropTypes.bool,
  children: PropTypes.node,
};

Touchable.defaultProps = {
  circle: false,
  children: null,
};

export default Touchable;
