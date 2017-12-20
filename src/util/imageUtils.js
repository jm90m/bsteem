import filesize from 'filesize';

const IMG_PROXY = 'https://steemitimages.com/0x0/';
const IMG_PROXY_PREVIEW = 'https://steemitimages.com/600x800/';

export const MAXIMUM_UPLOAD_SIZE = 52428800;
export const MAXIMUM_UPLOAD_SIZE_HUMAN = filesize(MAXIMUM_UPLOAD_SIZE);

export const getProxyImageURL = (url, type) => {
  if (type === 'preview') {
    return `${IMG_PROXY_PREVIEW}${url}`;
  }
  return `${IMG_PROXY}${url}`;
};

export const isValidImage = file => file.type.match('image/.*') && file.size <= MAXIMUM_UPLOAD_SIZE;

export function isUrl(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?' + // port
    '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
    '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return pattern.test(str);
}

export function getValidImageUrl(images) {
  let firstImage = null;
  for (let i = 0; i < images.length; i += 1) {
    const image = images[i];
    if (isUrl(image)) {
      firstImage = images[i];
      break;
    }
  }
  return firstImage;
}
