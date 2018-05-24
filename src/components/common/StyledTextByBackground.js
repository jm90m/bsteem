import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { getCustomTheme } from 'state/rootReducer';
import tinycolor from 'tinycolor2';
import { COLORS } from 'constants/styles';

const StyledTextByBackground = styled.Text`
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

StyledTextByBackground.propTypes = {
  customTheme: PropTypes.shape().isRequired,
};

export default connect(mapStateToProps)(StyledTextByBackground);
