import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import SavePostButton from 'components/post/SavePostButton';
import TouchableWithFeedNavigation from 'components/navigation/TouchableWithFeedNavigation';
import Tag from 'components/post/Tag';

const styles = StyleSheet.create({
  tagContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  savePostContainer: {
    marginLeft: 'auto',
  },
});

class TagContainer extends React.PureComponent {
  static propTypes = {
    tag: PropTypes.string,
    title: PropTypes.string,
    permlink: PropTypes.string,
    author: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    created: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  static defaultProps = {
    tag: '',
    title: '',
    permlink: '',
    author: '',
    id: '',
    created: '',
  };

  render() {
    const { tag, title, permlink, author, id, created } = this.props;
    return (
      <View style={styles.tagContainer}>
        <TouchableWithFeedNavigation tag={tag}>
          <Tag tag={tag} />
        </TouchableWithFeedNavigation>
        <View style={styles.savePostContainer}>
          <SavePostButton
            title={title}
            permlink={permlink}
            author={author}
            id={id}
            created={created}
          />
        </View>
      </View>
    );
  }
}

export default TagContainer;
