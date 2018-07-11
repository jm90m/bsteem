import React from 'react';
import PropTypes from 'prop-types';
import { getCustomTheme } from 'state/rootReducer';
import { View, Text, StyleSheet } from 'react-native';
import _ from 'lodash';
import TouchableWithUserNavigation from 'components/navigation/TouchableWithUserNavigation';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { FONTS } from 'constants/styles';
import { jsonStringify } from '../../../util/bsteemUtils';

const styles = StyleSheet.create({
  authorText: {
    fontSize: 16,
    fontFamily: FONTS.SECONDARY,
  },
});

class Author extends React.Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    currentUsername: PropTypes.string,
    author: PropTypes.string,
  };

  static defaultProps = {
    currentUsername: '', // Don't pass currentUsername if you don't want this to be a link
    author: '',
  };

  shouldComponentUpdate(nextProps) {
    const diffCustomTheme =
      jsonStringify(this.props.customTheme) !== jsonStringify(nextProps.customTheme);
    const diffAuthor = this.props.author !== nextProps.author;
    const diffCurrentUsername = this.props.currentUsername !== nextProps.currentUsername;

    return diffCustomTheme || diffAuthor || diffCurrentUsername;
  }

  render() {
    const { currentUsername, customTheme, author } = this.props;
    const authorColor = { color: customTheme.primaryColor };
    const authorText = <Text style={[styles.authorText, authorColor]}>{author}</Text>;

    if (currentUsername === author) {
      return authorText;
    }

    return (
      <TouchableWithUserNavigation username={author}>
        <View>{authorText}</View>
      </TouchableWithUserNavigation>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(withNavigation(Author));
