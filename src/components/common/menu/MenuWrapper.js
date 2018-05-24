import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const { width: deviceWidth } = Dimensions.get('screen');

const MenuWrapper = styled.View`
  background-color: ${props => props.customTheme.tertiaryColor};
  z-index: 1;
  border-radius: 4px;
  width: ${deviceWidth - 20}px;
  margin-bottom: 10px;
`;

MenuWrapper.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(MenuWrapper);
