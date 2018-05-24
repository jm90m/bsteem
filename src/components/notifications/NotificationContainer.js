import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const NotificationContainer = styled.View`
  padding: 10px;
  margin-bottom: 5px;
  flex-direction: row;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(NotificationContainer);
