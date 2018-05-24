import _ from 'lodash';
import { Dimensions } from 'react-native';
import { getHtml } from './postUtils';
import steemEmbed from './steemEmbed';
import { getProxyImageURL } from './imageUtils';

const { width: deviceWidth } = Dimensions.get('screen');

const START_WITH_PERCENT = 5;

export const getPositions = text => {
  const imgPos = text.indexOf('<img');
  const embedPos = text.indexOf('<iframe');
  const percentMultiplier = 100 / text.length;
  const firstEmbed = embedPos !== -1 ? embedPos * percentMultiplier : undefined;
  const firstImage = imgPos !== -1 ? imgPos * percentMultiplier : undefined;
  return { embed: firstEmbed, image: firstImage };
};

export const postWithPicture = (tagPositions, searchPosition) => {
  const result = tagPositions.image && tagPositions.image < searchPosition;
  if (tagPositions.embed !== undefined) {
    return tagPositions.embed > tagPositions.image && result;
  }
  return result;
};

export const postWithAnEmbed = (tagPositions, searchPosition) => {
  const result = tagPositions.embed && tagPositions.embed < searchPosition;
  if (tagPositions.image !== undefined) {
    return tagPositions.image > tagPositions.embed && result;
  }
  return result;
};

export const isPostStartsWithAPicture = tagPositions =>
  postWithPicture(tagPositions, START_WITH_PERCENT);
export const isPostStartsWithAnEmbed = tagPositions =>
  postWithAnEmbed(tagPositions, START_WITH_PERCENT);
export const isPostWithPictureBeforeFirstHalf = tagPositions => postWithPicture(tagPositions, 50);
export const isPostWithEmbedBeforeFirstHalf = tagPositions => postWithAnEmbed(tagPositions, 50);

export const getPostPreviewComponents = (
  postBody,
  textComponent,
  imageComponent,
  videoComponent,
  dTubeEmbedComponent,
) => {
  const htmlBody = getHtml(postBody, {}, 'text');
  const tagPositions = getPositions(htmlBody);
  const previewComponents = [];
  const hasImage = !_.isEmpty(imageComponent);
  const hasDtubeVideo = !_.isNull(dTubeEmbedComponent);

  if (hasDtubeVideo) {
    previewComponents.push(videoComponent);
    previewComponents.push(textComponent);
  } else if (htmlBody.length <= 1500 && postWithPicture(tagPositions, 100)) {
    previewComponents.push(imageComponent);
    previewComponents.push(textComponent);
  } else if (htmlBody.length <= 1500 && postWithAnEmbed(tagPositions, 100)) {
    previewComponents.push(videoComponent);
    previewComponents.push(textComponent);
  } else if (isPostStartsWithAPicture(tagPositions)) {
    previewComponents.push(imageComponent);
    previewComponents.push(textComponent);
  } else if (isPostStartsWithAnEmbed(tagPositions)) {
    previewComponents.push(videoComponent);
    previewComponents.push(textComponent);
  } else if (isPostWithPictureBeforeFirstHalf(tagPositions)) {
    previewComponents.push(textComponent);
    previewComponents.push(imageComponent);
  } else if (isPostWithEmbedBeforeFirstHalf(tagPositions)) {
    previewComponents.push(textComponent);
    previewComponents.push(videoComponent);
  } else if (hasImage) {
    previewComponents.push(textComponent);
    previewComponents.push(imageComponent);
  } else {
    previewComponents.push(textComponent);
  }

  return previewComponents;
};

export const getEmbeds = (postData, embedOptions = {}) => {
  const jsonMetadata = _.attempt(JSON.parse, postData.json_metadata);
  const postJSONMetadata = _.isError(jsonMetadata) ? {} : jsonMetadata;
  const embeds = steemEmbed.getAll(postData.body, embedOptions);
  const video = _.get(postJSONMetadata, 'video');
  const hasDtubeVideo = _.has(video, 'content.videohash') && _.has(video, 'info.snaphash');

  if (hasDtubeVideo) {
    const author = _.get(video, 'info.author', '');
    const permlink = _.get(video, 'info.permlink', '');
    const dTubeEmbedUrl = `https://emb.d.tube/#!/${author}/${permlink}`;
    const dTubeIFrame = `<iframe width="${deviceWidth -
      20}" height="340" src="${dTubeEmbedUrl}" allowFullScreen></iframe>`;
    embeds[0] = {
      type: 'video',
      provider_name: 'DTube',
      embed: dTubeIFrame,
      thumbnail: getProxyImageURL(`https://ipfs.io/ipfs/${video.info.snaphash}`, 'preview'),
    };
  }

  return embeds;
};
