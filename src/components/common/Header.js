import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
  width: 100%;
  padding-top: ${Platform.OS === 'ios' ? '20px' : '30px'};
  min-height: ${Platform.OS === 'ios' ? '45px' : `${StatusBar.currentHeight + 30}px`};
`;

const HeaderContainer = ({ customTheme, children }) => (
  <Header customTheme={customTheme}>{children}</Header>
);

HeaderContainer.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  children: PropTypes.node,
};

HeaderContainer.defaultProps = {
  children: null,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(HeaderContainer);
