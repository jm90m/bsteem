import getUrls from 'get-urls';

const SteemEmbed = {};

SteemEmbed.getUrls = function(text) {
  var urls = [];
  try {
    urls = getUrls(text);
  } catch (e) {
    console.log(e);
  }
  return urls;
};

SteemEmbed.getAll = function(text, options) {
  const embeds = [];

  if (!options) options = {};
  options.width = options.width || '100%';
  options.height = options.height || '400';
  options.autoplay = 'autoplay' in options ? options.autoplay : true;

  const urls = this.getUrls(text);
  urls.forEach(
    function(url) {
      var embed = this.get(url, options);
      if (embed) {
        embeds.push(this.get(url, options));
      }
    }.bind(this),
  );
  return embeds;
};

SteemEmbed.get = function(url, options) {
  const youtubeId = this.isYoutube(url);
  const twitchChannel = this.isTwitch(url);
  const periscopeId = this.isPeriscope(url);
  const soundcloudId = this.isSoundcloud(url);
  const vimeoId = this.isVimeo(url);
  if (youtubeId) {
    return {
      type: 'video',
      url: url,
      provider_name: 'YouTube',
      thumbnail: 'https://i.ytimg.com/vi/' + youtubeId + '/hqdefault.jpg',
      id: youtubeId,
      embed: this.youtube(url, youtubeId, options),
    };
  } else if (twitchChannel) {
    return {
      type: 'video',
      url: url,
      provider_name: 'Twitch',
      id: twitchChannel,
      embed: this.twitch(url, twitchChannel, options),
    };
  } else if (periscopeId) {
    return {
      type: 'video',
      url: url,
      provider_name: 'Periscope',
      id: periscopeId,
      embed: this.periscope(url, periscopeId, options),
    };
  } else if (soundcloudId) {
    return {
      type: 'music',
      url: url,
      provider_name: 'SoundCloud',
      id: soundcloudId,
      embed: this.soundcloud(url, soundcloudId, options),
    };
  } else if (vimeoId) {
    return {
      type: 'music',
      url: url,
      provider_name: 'Vimeo',
      id: vimeoId,
      embed: this.vimeo(url, vimeoId, options),
    };
  }
};

SteemEmbed.isYoutube = function(url) {
  const p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return url.match(p) ? RegExp.$1 : false;
};

SteemEmbed.youtube = function(url, id, options) {
  const timerMatches = url.match(/[?&]t=([0-9]+h)*([0-9]+m)*([0-9]+s)+/);
  const autoplayValue = options.autoplay ? 1 : 0;
  let srcUrl = 'https://www.youtube.com/embed/' + id + '?autoplay=' + autoplayValue;
  if (timerMatches && timerMatches[3]) {
    srcUrl +=
      '&start=' +
      ((parseInt(timerMatches[1], 10) || 0) * 3600 +
        (parseInt(timerMatches[2]) || 0) * 60 +
        (parseInt(timerMatches[3]) || 0));
  }
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="' +
    srcUrl +
    '" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isTwitch = function(url) {
  const p = /^(?:https?:\/\/)?(?:www\.)?(?:twitch.tv\/)(.*)?$/;
  return url.match(p) ? RegExp.$1 : false;
};

SteemEmbed.twitch = function(url, channel, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="https://player.twitch.tv/?channel=' +
    channel +
    '&autoplay=false" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isPeriscope = function(url) {
  const p = /^(?:https?:\/\/)?(?:www\.)?(?:periscope.tv\/)(.*)?$/;
  const m = url.match(p) ? RegExp.$1.split('/') : [];
  const r = m[1] ? m[1] : false;
  return r;
};

SteemEmbed.periscope = function(url, id, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="https://www.periscope.tv/w/' +
    id +
    '" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isSoundcloud = function(url) {
  const p = /^(?:https?:\/\/)?(?:www\.)?(?:soundcloud.com\/)(.*)?$/;
  return url.match(p) ? RegExp.$1 : false;
};

SteemEmbed.soundcloud = function(url, id, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="https://w.soundcloud.com/player/?url=' +
    encodeURIComponent(url + '?visual=true') +
    '" frameborder="0" scrolling="no" allowfullscreen></iframe>'
  );
};

SteemEmbed.isVimeo = function(url) {
  const p = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
  return url.match(p) ? RegExp.$3 : false;
};

SteemEmbed.vimeo = function(url, id, options) {
  return (
    '<iframe width="' +
    options.width +
    '" height="' +
    options.height +
    '" src="https://player.vimeo.com/video/' +
    id +
    '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
  );
};

export default SteemEmbed;
