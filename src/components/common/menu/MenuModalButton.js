import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const MenuModalButton = styled.TouchableOpacity`
  padding: 10px;
  width: 100%;
  margin: 2px 0;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  border-top-width: 1px;
  border-top-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

MenuModalButton.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps)(MenuModalButton);
