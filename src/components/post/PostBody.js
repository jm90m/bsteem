import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, View } from 'react-native';
import HTML from 'react-native-render-html';
import { COLORS, FONTS } from 'constants/styles';
import * as postConstants from 'constants/postConstants';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import tinycolor from 'tinycolor2';
import { getHtml } from 'util/postUtils';
import LargeLoading from 'components/common/LargeLoading';
import { WebBrowser } from 'expo';
import { withNavigation } from 'react-navigation';
import { jsonStringify } from '../../util/bsteemUtils';
import * as navigationConstants from '../../constants/navigation';

const { width: deviceWidth } = Dimensions.get('screen');

const styles = StyleSheet.create({
  loadingContainer: {
    marginTop: 50,
    marginBottom: 50,
  },
});

class PostBody extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    parsedJsonMetadata: PropTypes.shape(),
    body: PropTypes.string,
    widthOffset: PropTypes.number,
  };

  static defaultProps = {
    body: '',
    parsedJsonMetadata: {},
    widthOffset: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      parsedHtmlBody: '<div></div>',
    };

    this.handlePostLinkPress = this.handlePostLinkPress.bind(this);
    this.navigateToUser = this.navigateToUser.bind(this);
    this.navigateToFeed = this.navigateToFeed.bind(this);
  }

  componentDidMount() {
    const { body, parsedJsonMetadata, widthOffset } = this.props;
    const embedOptions = { width: deviceWidth - widthOffset };
    const parsedHtmlBody = getHtml(body, parsedJsonMetadata, 'Object', embedOptions);

    if (body.length >= 2000) {
      _.delay(
        () =>
          this.setState({
            loading: false,
            parsedHtmlBody,
          }),
        1000,
      );
    } else {
      this.setState({
        loading: false,
        parsedHtmlBody,
      });
    }
  }

  navigateToUser(username) {
    this.props.navigation.push(navigationConstants.USER, { username });
  }

  navigateToFeed(tag) {
    this.props.navigation.push(navigationConstants.FEED, { tag });
  }

  handlePostLinkPress(e, url) {
    console.log('clicked link: ', url);
    const isTag = _.includes(url, postConstants.POST_HTML_BODY_TAG);
    const isUser = _.includes(url, postConstants.POST_HTML_BODY_USER);

    if (isUser) {
      const user = _.get(_.split(url, postConstants.POST_HTML_BODY_USER), 1, 'bsteem');
      this.navigateToUser(user);
    } else if (isTag) {
      const tag = _.get(_.split(url, postConstants.POST_HTML_BODY_TAG), 1, 'bsteem');
      this.navigateToFeed(tag);
    } else {
      WebBrowser.openBrowserAsync(url).catch(error => {
        console.log('invalid url', error, url);
      });
    }
  }

  render() {
    const { customTheme, widthOffset } = this.props;
    const { loading, parsedHtmlBody } = this.state;

    return loading ? (
      <View style={styles.loadingContainer}>
        <LargeLoading />
      </View>
    ) : (
      <HTML
        html={parsedHtmlBody}
        imagesMaxWidth={deviceWidth - widthOffset}
        onLinkPress={this.handlePostLinkPress}
        staticContentMaxWidth={deviceWidth - widthOffset}
        baseFontStyle={{
          color: tinycolor(customTheme.primaryBackgroundColor).isDark()
            ? COLORS.LIGHT_TEXT_COLOR
            : COLORS.DARK_TEXT_COLOR,
          fontFamily: FONTS.PRIMARY,
        }}
        textSelectable
      />
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(withNavigation(PostBody));
