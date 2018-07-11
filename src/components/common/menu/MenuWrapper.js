import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const MenuWrapper = styled.View`
  background-color: transparent;
  z-index: 1;
  border-radius: 4px;
  margin-bottom: 10px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
`;

MenuWrapper.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(MenuWrapper);
