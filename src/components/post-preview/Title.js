import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import Touchable from 'components/common/Touchable';
import commonStyles from 'styles/common';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import * as navigationConstants from '../../constants/navigation';
import { jsonParse, jsonStringify } from '../../util/bsteemUtils';

class Title extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    postData: PropTypes.shape(),
  };
  static defaultProps = {
    postData: {},
  };

  constructor(props) {
    super(props);

    this.handleNavigateToPost = this.handleNavigateToPost.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return jsonStringify(this.props.postData) !== jsonStringify(nextProps.postData);
  }

  handleNavigateToPost() {
    const { postData } = this.props;
    const { title, category, author, json_metadata, body, permlink, id } = postData;
    const parsedJsonMetadata = jsonParse(json_metadata);
    this.props.navigation.push(navigationConstants.POST, {
      title,
      body,
      permlink,
      author,
      parsedJsonMetadata,
      category,
      postId: id,
    });
  }

  render() {
    return (
      <Touchable onPress={this.handleNavigateToPost}>
        <View>
          <StyledTextByBackground style={commonStyles.postTitle}>
            {this.props.postData.title}
          </StyledTextByBackground>
        </View>
      </Touchable>
    );
  }
}

export default withNavigation(Title);
