import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { isPostTaggedNSFW } from 'util/postUtils';
import _ from 'lodash';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import PrimaryText from 'components/common/text/PrimaryText';
import Touchable from 'components/common/Touchable';
import { getCustomTheme, getIntl, getReportedPosts } from '../../state/rootReducer';

const styles = StyleSheet.create({
  hiddenPreviewText: {
    paddingHorizontal: 5,
  },
  hiddenContentLink: {
    paddingHorizontal: 5,
  },
});

const HiddenPreviewText = ({
  displayHiddenContent,
  intl,
  customTheme,
  reportedPosts,
  postData,
}) => {
  const isReported = _.findIndex(reportedPosts, post => post.id === postData.id) > -1;
  let hiddenPreviewText = intl.post_preview_hidden_for_low_ratings;

  if (isPostTaggedNSFW(postData)) {
    hiddenPreviewText = intl.post_preview_hidden_for_nsfw;
  } else if (isReported) {
    hiddenPreviewText = intl.reported_post_hidden;
  }

  return (
    <View>
      <StyledTextByBackground
        style={styles.hiddenPreviewText}
      >{`${hiddenPreviewText} `}</StyledTextByBackground>
      <Touchable onPress={displayHiddenContent}>
        <View>
          <PrimaryText style={[styles.hiddenContentLink, { color: customTheme.primaryColor }]}>
            {intl.display_post_preview}
          </PrimaryText>
        </View>
      </Touchable>
    </View>
  );
};

HiddenPreviewText.propTypes = {
  intl: PropTypes.shape().isRequired,
  customTheme: PropTypes.shape().isRequired,
  reportedPosts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  displayHiddenContent: PropTypes.func,
  postData: PropTypes.shape(),
};

HiddenPreviewText.defaultProps = {
  displayHiddenContent: () => {},
  postData: {},
};

const mapStateToProps = state => ({
  intl: getIntl(state),
  customTheme: getCustomTheme(state),
  reportedPosts: getReportedPosts(state),
});

export default connect(mapStateToProps)(HiddenPreviewText);
