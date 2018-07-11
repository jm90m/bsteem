import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const Container = styled.View`
  padding: 10px;
  width: 100%;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: ${props => (props.isLastElement ? '0px' : '1px')};
`;

const MenuModalButton = ({ customTheme, children, onPress, isLastElement }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <Container customTheme={customTheme} isLastElement={isLastElement}>
      {children}
    </Container>
  </TouchableWithoutFeedback>
);

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

MenuModalButton.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  onPress: PropTypes.func.isRequired,
  isLastElement: PropTypes.bool,
  children: PropTypes.node,
};

MenuModalButton.defaultProps = {
  children: null,
  isLastElement: false,
};

export default connect(mapStateToProps)(MenuModalButton);
