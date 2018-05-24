import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const IconContainer = styled.View`
  align-items: center;
  background-color: ${props => props.customTheme.tertiaryColor};
  border-radius: 4px;
  display: flex;
  height: 40px;
  justify-content: center;
  width: 44px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

IconContainer.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps)(IconContainer);
