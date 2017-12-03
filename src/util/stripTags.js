// taken from https://github.com/ericnorris/striptags/blob/master/src/striptags.js
let Symbol = Symbol;

if (typeof Symbol !== 'function') {
  Symbol = function(name) {
    return name;
  };

  Symbol.nonNative = true;
}

const STATE_PLAINTEXT = Symbol('plaintext');
const STATE_HTML = Symbol('html');
const STATE_COMMENT = Symbol('comment');
const ALLOWED_TAGS_REGEX = /<(\w*)>/g;
const NORMALIZE_TAG_REGEX = /<\/?([^\s\/>]+)/;

export const striptags = (html, allowable_tags, tag_replacement) => {
  html = html || '';
  allowable_tags = allowable_tags || [];
  tag_replacement = tag_replacement || '';

  let context = init_context(allowable_tags, tag_replacement);

  return striptags_internal(html, context);
};

const init_context = (allowable_tags, tag_replacement) => {
  allowable_tags = parse_allowable_tags(allowable_tags);

  return {
    allowable_tags: allowable_tags,
    tag_replacement: tag_replacement,

    state: STATE_PLAINTEXT,
    tag_buffer: '',
    depth: 0,
    in_quote_char: '',
  };
};

const striptags_internal = (html, context) => {
  let allowable_tags = context.allowable_tags;
  let tag_replacement = context.tag_replacement;

  let state = context.state;
  let tag_buffer = context.tag_buffer;
  let depth = context.depth;
  let in_quote_char = context.in_quote_char;
  let output = '';

  for (let idx = 0, length = html.length; idx < length; idx++) {
    let char = html[idx];

    if (state === STATE_PLAINTEXT) {
      switch (char) {
        case '<':
          state = STATE_HTML;
          tag_buffer += char;
          break;

        default:
          output += char;
          break;
      }
    } else if (state === STATE_HTML) {
      switch (char) {
        case '<':
          // ignore '<' if inside a quote
          if (in_quote_char) {
            break;
          }

          // we're seeing a nested '<'
          depth++;
          break;

        case '>':
          // ignore '>' if inside a quote
          if (in_quote_char) {
            break;
          }

          // something like this is happening: '<<>>'
          if (depth) {
            depth--;

            break;
          }

          // this is closing the tag in tag_buffer
          in_quote_char = '';
          state = STATE_PLAINTEXT;
          tag_buffer += '>';

          if (allowable_tags.has(normalize_tag(tag_buffer))) {
            output += tag_buffer;
          } else {
            output += tag_replacement;
          }

          tag_buffer = '';
          break;

        case '"':
        case "'":
          // catch both single and double quotes

          if (char === in_quote_char) {
            in_quote_char = '';
          } else {
            in_quote_char = in_quote_char || char;
          }

          tag_buffer += char;
          break;

        case '-':
          if (tag_buffer === '<!-') {
            state = STATE_COMMENT;
          }

          tag_buffer += char;
          break;

        case ' ':
        case '\n':
          if (tag_buffer === '<') {
            state = STATE_PLAINTEXT;
            output += '< ';
            tag_buffer = '';

            break;
          }

          tag_buffer += char;
          break;

        default:
          tag_buffer += char;
          break;
      }
    } else if (state === STATE_COMMENT) {
      switch (char) {
        case '>':
          if (tag_buffer.slice(-2) == '--') {
            // close the comment
            state = STATE_PLAINTEXT;
          }

          tag_buffer = '';
          break;

        default:
          tag_buffer += char;
          break;
      }
    }
  }

  // save the context for future iterations
  context.state = state;
  context.tag_buffer = tag_buffer;
  context.depth = depth;
  context.in_quote_char = in_quote_char;

  return output;
};

const parse_allowable_tags = allowable_tags => {
  let tag_set = new Set();

  if (typeof allowable_tags === 'string') {
    let match;

    while ((match = ALLOWED_TAGS_REGEX.exec(allowable_tags))) {
      tag_set.add(match[1]);
    }
  } else if (!Symbol.nonNative && typeof allowable_tags[Symbol.iterator] === 'function') {
    tag_set = new Set(allowable_tags);
  } else if (typeof allowable_tags.forEach === 'function') {
    // IE11 compatible
    allowable_tags.forEach(tag_set.add, tag_set);
  }

  return tag_set;
};

const normalize_tag = tag_buffer => {
  let match = NORMALIZE_TAG_REGEX.exec(tag_buffer);

  return match ? match[1].toLowerCase() : null;
};
