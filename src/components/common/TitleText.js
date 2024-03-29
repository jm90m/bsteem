import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { getCustomTheme } from 'state/rootReducer';
import { FONTS } from 'constants/styles';

const TitleText = styled.Text`
  color: ${props => props.customTheme.primaryColor};
  font-family: ${FONTS.TITLE};
`;

TitleText.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(TitleText);
