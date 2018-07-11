import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { getCustomTheme } from 'state/rootReducer';
import PrimaryText from 'components/common/text/PrimaryText';

const PrimaryColorText = styled(PrimaryText)`
  color: ${props => props.customTheme.primaryColor};
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

PrimaryColorText.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps)(PrimaryColorText);
