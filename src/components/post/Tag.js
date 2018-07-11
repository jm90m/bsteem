import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS, FONTS } from 'constants/styles';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import tinycolor from 'tinycolor2';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagContainer: {
    alignItems: 'center',
    borderRadius: 3,
    height: 25,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  tag: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: FONTS.PRIMARY,
  },
});

const Tag = ({ tag, customTheme }) => {
  const containerCustomStyles = {
    borderWidth: 2,
    borderColor: customTheme.secondaryColor,
    backgroundColor: customTheme.secondaryColor,
  };
  const textCustomStyles = {
    color: tinycolor(customTheme.secondaryColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR,
  };

  return (
    <View style={styles.container}>
      <View style={[styles.tagContainer, containerCustomStyles]}>
        <Text style={[styles.tag, textCustomStyles]}>{tag}</Text>
      </View>
    </View>
  );
};

Tag.propTypes = {
  tag: PropTypes.string,
  customTheme: PropTypes.shape().isRequired,
};

Tag.defaultProps = {
  tag: '',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(Tag);
