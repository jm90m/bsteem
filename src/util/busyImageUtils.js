export const getAvatarImageUrl = (username, size) =>
  size > 64
    ? `https://steemitimages.com/u/${username}/avatar`
    : `https://steemitimages.com/u/${username}/avatar/small`;

export const getUserBackgroundCoverUrl = coverImage =>
  `https://steemitimages.com/2048x512/${coverImage}`;
