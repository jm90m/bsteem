export const getFacebookShareURL = url => `https://facebook.com/sharer/sharer.php?u=${url}`;
export const getTwitterShareURL = (text, url) =>
  `https://twitter.com/intent/tweet/?text=${text}&url=${url}`;
