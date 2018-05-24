import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import * as navigationConstants from 'constants/navigation';
import _ from 'lodash';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import StyledTextByBackground from '../common/StyledTextByBackground';

const ReplyText = styled(StyledTextByBackground)`
  font-size: 14px;
  font-weight: bold;
`;

const ReplyContainer = styled.View`
  padding: 10px;
  border-width: 1px;
  border-color: ${props => props.customTheme.primaryBorderColor};
`;

const LinkText = styled.Text`
  color: ${props => props.customTheme.primaryColor};
  font-weight: bold;
`;

const mapStateToProps = state => ({
  intl: getIntl(state),
  customTheme: getCustomTheme(state),
});

class ReplyHeader extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    navigation: PropTypes.shape().isRequired,
    postData: PropTypes.shape(),
  };

  static defaultProps = {
    postData: {},
  };

  constructor(props) {
    super(props);

    this.handlePostNavigation = this.handlePostNavigation.bind(this);
  }

  handlePostNavigation() {
    const { navigation, postData } = this.props;
    const author = _.get(postData, 'parent_author');
    const permlink = _.get(postData, 'parent_permlink');
    navigation.navigate(navigationConstants.FETCH_POST, { author, permlink });
  }

  render() {
    const { intl, postData, customTheme } = this.props;
    const depth = _.get(postData, 'depth', 0);
    const rootTitle = _.get(postData, 'root_title', '');

    if (depth !== 0) {
      return (
        <ReplyContainer customTheme={customTheme}>
          <ReplyText>{`${intl.post_reply_to_header}: ${rootTitle}`}</ReplyText>
          <TouchableWithoutFeedback onPress={this.handlePostNavigation}>
            <LinkText customTheme={customTheme}>{intl.show_original_post}</LinkText>
          </TouchableWithoutFeedback>
        </ReplyContainer>
      );
    }
    return null;
  }
}

export default connect(mapStateToProps)(ReplyHeader);
