import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { getCustomTheme } from 'state/rootReducer';

const PrimaryColorText = styled.Text`
  color: ${props => props.customTheme.primaryColor};
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

PrimaryColorText.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps)(PrimaryColorText);
