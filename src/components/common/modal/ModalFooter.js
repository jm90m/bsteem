import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import tinycolor from 'tinycolor2';

const Container = styled.View`
  flex-direction: row-reverse;
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
  padding: 10px 16px 10px 10px;
`;

const Button = styled.TouchableOpacity`
  padding: 16px;
  background-color: ${props => props.backgroundColor};
  border: 2px solid ${props => props.borderColor};
  border-radius: 4px;
  margin: 0 5px;
`;

const ButtonText = styled.Text`
  color: ${props => props.color};
`;

const ModalFooter = ({
  cancelText,
  cancelPress,
  successText,
  successPress,
  displaySuccess,
  customTheme,
}) => (
  <Container customTheme={customTheme}>
    {displaySuccess && (
      <Button
        backgroundColor={customTheme.primaryColor}
        borderColor={customTheme.primaryColor}
        onPress={successPress}
      >
        <ButtonText
          color={
            tinycolor(customTheme.primaryColor).isDark()
              ? COLORS.LIGHT_TEXT_COLOR
              : COLORS.DARK_TEXT_COLOR
          }
        >
          {successText}
        </ButtonText>
      </Button>
    )}
    <Button
      backgroundColor={customTheme.tertiaryColor}
      borderColor={customTheme.tertiaryColor}
      onPress={cancelPress}
    >
      <ButtonText
        color={
          tinycolor(customTheme.tertiaryColor).isDark()
            ? COLORS.LIGHT_TEXT_COLOR
            : COLORS.DARK_TEXT_COLOR
        }
      >
        {cancelText}
      </ButtonText>
    </Button>
  </Container>
);

ModalFooter.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  cancelText: PropTypes.string,
  cancelPress: PropTypes.func,
  successText: PropTypes.string,
  successPress: PropTypes.func,
  displaySuccess: PropTypes.bool,
};

ModalFooter.defaultProps = {
  cancelText: '',
  cancelPress: () => {},
  successText: '',
  successPress: () => {},
  displaySuccess: true,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(ModalFooter);
