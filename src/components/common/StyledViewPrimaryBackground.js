import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { getCustomTheme } from 'state/rootReducer';

const StyledViewPrimaryBackground = styled.View`
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

StyledViewPrimaryBackground.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(StyledViewPrimaryBackground);
