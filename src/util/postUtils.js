import React from 'react';
import _ from 'lodash';
import Remarkable from 'remarkable';
import htmlReady from '../util/steemitHtmlReady';
import sanitizeHtml from 'sanitize-html';
import sanitizeConfig from './sanitizeConfig';
import SteemEmbed from './steemEmbed';

export const imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))/gi;

const remarkable = new Remarkable({
  html: true, // remarkable renders first then sanitize runs...
  breaks: true,
  linkify: false, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: '“”‘’',
});

export function getHtml(body, parsedJsonMetadata, returnType = 'Object') {
  try {
    parsedJsonMetadata.image = _.get(parsedJsonMetadata, 'image', []);
    let parsedBody = body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

    parsedBody.replace(imageRegex, img => {
      if (_.filter(parsedJsonMetadata.image, i => i.indexOf(img) !== -1).length === 0) {
        parsedJsonMetadata.image.push(img);
      }
    });

    const htmlReadyOptions = { mutate: true, resolveIframe: returnType === 'text' };
    parsedBody = remarkable.render(parsedBody);
    parsedBody = htmlReady(parsedBody, htmlReadyOptions).html;
    parsedBody = sanitizeHtml(parsedBody, sanitizeConfig({}));
    if (returnType === 'text') {
      return parsedBody;
    }
    const sections = [];
    const splittedBody = parsedBody.split('~~~ embed:');
    for (let i = 0; i < splittedBody.length; i += 1) {
      let section = splittedBody[i];

      const match = section.match(/^([A-Za-z0-9_-]+) ([A-Za-z]+) (\S+) ~~~/);
      if (match && match.length >= 4) {
        const id = match[1];
        const type = match[2];
        const link = match[3];
        const embed = SteemEmbed.get(link, { width: '100%', height: 400, autoplay: false });
        sections.push(`<div>${embed.embed}</div>`);
        section = section.substring(`${id} ${type} ${link} ~~~`.length);
      }
      if (section !== '') {
        sections.push(section);
      }
    }
    return sections.join('');
  } catch (error) {
    console.log(error);
  }
  return '<div>Error parsing this post</div>';
}

export const isPostTaggedNSFW = post => {
  if (_.get(post, 'parent_permlink') === 'nsfw') return true;

  const postJSONMetaData = _.attempt(JSON.parse, post.json_metadata);

  if (_.isError(postJSONMetaData)) return false;

  return _.includes(postJSONMetaData.tags, 'nsfw');
};
