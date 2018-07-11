import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { View, Dimensions } from 'react-native';
import { getEmbeds, getPostPreviewComponents } from 'util/postPreviewUtils';
import { jsonParse } from 'util/bsteemUtils';
import { getProxyImageURL } from 'util/imageUtils';
import Touchable from 'components/common/Touchable';
import { withNavigation } from 'react-navigation';
import * as navigationConstants from 'constants/navigation';
import { getCompactViewEnabled } from 'state/rootReducer';
import PostImage from '../post/PostImage';
import BodyShort from './BodyShort';
import EmbedContent from './EmbedContent';
import { jsonStringify } from '../../util/bsteemUtils';

const { width: deviceWidth } = Dimensions.get('screen');

class PreviewContent extends React.Component {
  static propTypes = {
    compactViewEnabled: PropTypes.bool.isRequired,
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
    const diffPostData = jsonStringify(this.props.postData) !== jsonStringify(nextProps.postData);
    const diffCompactViewEnabled = this.props.compactViewEnabled !== nextProps.compactViewEnabled;
    return diffPostData || diffCompactViewEnabled;
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
    const { postData, compactViewEnabled } = this.props;
    const { json_metadata, body, id } = postData;
    const textComponent = (
      <Touchable onPress={this.handleNavigateToPost} key={`text-component-${id}`}>
        <View>
          <BodyShort content={body} />
        </View>
      </Touchable>
    );

    if (compactViewEnabled) return textComponent;

    const jsonMetadata = _.attempt(JSON.parse, json_metadata);
    const postJSONMetaData = _.isError(jsonMetadata) ? {} : jsonMetadata;
    const images = _.get(postJSONMetaData, 'image', []);
    const previewImage = _.head(images);
    const hasPreviewImage = images.length > 0 && !_.isEmpty(previewImage);
    const embedOptions = {};
    const embeds = getEmbeds(postData, embedOptions);
    const firstEmbed = _.head(embeds);
    const hasVideo = !_.isEmpty(firstEmbed);
    const video = _.get(postJSONMetaData, 'video', {});
    let dTubeEmbedComponent = null;

    if (_.has(video, 'content.videohash') && _.has(video, 'info.snaphash')) {
      const author = _.get(video, 'info.author', '');
      const permlink = _.get(video, 'info.permlink', '');
      const dTubeEmbedUrl = `https://emb.d.tube/#!/${author}/${permlink}/true`;
      const snaphash = _.get(video, 'info.snaphash', '');
      const dTubeIFrame = `<iframe width="${deviceWidth +
        20}" height="340" src="${dTubeEmbedUrl}" allowFullScreen frameborder="0" scrolling="no"></iframe>`;
      const dtubeEmbedContent = {
        type: 'video',
        provider_name: 'DTube',
        embed: dTubeIFrame,
        thumbnail: getProxyImageURL(`https://ipfs.io/ipfs/${snaphash}`, 'preview'),
        source: dTubeEmbedUrl,
      };
      dTubeEmbedComponent = (
        <EmbedContent
          embedContent={dtubeEmbedContent}
          key={`dtube-embed-component-${id}`}
          height={340}
        />
      );
    }

    const imageComponent = hasPreviewImage ? (
      <Touchable onPress={this.handleNavigateToPost} key={`image-component-${id}`}>
        <View>
          <PostImage images={images} />
        </View>
      </Touchable>
    ) : null;
    const embedComponent = hasVideo ? (
      <EmbedContent embedContent={firstEmbed} key={`embed-component-${id}`} />
    ) : null;

    return getPostPreviewComponents(
      body,
      textComponent,
      imageComponent,
      embedComponent,
      dTubeEmbedComponent,
    );
  }
}

const mapStateToProps = state => ({
  compactViewEnabled: getCompactViewEnabled(state),
});

export default connect(mapStateToProps)(withNavigation(PreviewContent));
