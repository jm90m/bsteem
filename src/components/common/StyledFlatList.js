import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const StyledFlatList = styled.FlatList`
  flex: 1;
  background-color: ${props => props.customTheme.listBackgroundColor};
`;

StyledFlatList.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(StyledFlatList);
