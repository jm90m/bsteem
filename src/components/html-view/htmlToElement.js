import React from 'react';
import _ from 'lodash';
import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import htmlparser from 'htmlparser2-without-node-native';
import entities from 'entities';

const { width } = Dimensions.get('screen');

const defaultOpts = {
  lineBreak: '\n',
  paragraphBreak: '\n\n',
  bullet: '\u2022 ',
  TextComponent: props => <Text selectable {...props} />,
  textComponentProps: null,
  NodeComponent: View,
  nodeComponentProps: null,
  handleImagePress: () => {},
};

const Img = props => {
  const imgWidth =
    parseInt(props.attribs['width'], 10) || parseInt(props.attribs['data-width'], 10) || 0;
  const imgHeight =
    parseInt(props.attribs['height'], 10) || parseInt(props.attribs['data-height'], 10) || 0;
  let setImgHeight = 300;

  if (imgHeight > 0 && imgHeight < width) {
    setImgHeight = imgHeight;
  } else if (imgHeight > 0 && imgHeight > width) {
    setImgHeight = width;
  }

  return (
    <TouchableOpacity onPress={() => props.handleImagePress(props.attribs.src, props.attribs.alt)}>
      <Image
        source={{ uri: props.attribs.src }}
        style={{ width: width - 20, height: setImgHeight, alignSelf: 'center', flex: 1 }}
        onError={() => {
          console.log('IMG URL ERROR', props.attribs.src);
        }}
        resizeMode={Image.resizeMode.contain}
      />
    </TouchableOpacity>
  );
};

export default function htmlToElement(rawHtml, customOpts = {}, done) {
  const opts = {
    ...defaultOpts,
    ...customOpts,
  };

  function inheritedStyle(parent) {
    if (!parent) return null;
    const style = StyleSheet.flatten(opts.styles[parent.name]) || {};
    const parentStyle = inheritedStyle(parent.parent) || {};
    return { ...parentStyle, ...style };
  }

  function domToElement(dom, parent) {
    if (!dom) return null;

    const renderNode = opts.customRenderer;
    let orderedListCounter = 1;

    console.log('DOM', dom);

    return dom.map((node, index, list) => {
      if (renderNode) {
        const rendered = renderNode(node, index, list, parent, domToElement);
        if (rendered || rendered === null) return rendered;
      }

      const { TextComponent } = opts;

      if (node.type === 'text') {
        const defaultStyle = opts.textComponentProps ? opts.textComponentProps.style : null;
        const customStyle = inheritedStyle(parent);
        console.log('htmlToElement - TEXT NODE TYPE', node.data);
        const nodeText = _.replace(node.data, /\n/g, '').trim();
        if (_.isEmpty(nodeText)) {
          return <Text style={{ width: 5, height: 5 }} key={index} />;
        } else {
          return (
            <TextComponent
              {...opts.textComponentProps}
              key={index}
              style={[defaultStyle, customStyle]}
            >
              {entities.decodeHTML(_.replace(node.data, /\n/g, ''))}
            </TextComponent>
          );
        }
      }

      if (node.type === 'tag') {
        if (node.name === 'img') {
          return (
            <Img key={index} attribs={node.attribs} handleImagePress={opts.handleImagePress} />
          );
        }

        let linkPressHandler = null;
        let linkLongPressHandler = null;
        if (node.name === 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.href));
          if (opts.linkLongPressHandler) {
            linkLongPressHandler = () =>
              opts.linkLongPressHandler(entities.decodeHTML(node.attribs.href));
          }
        }

        let listItemPrefix = null;
        if (node.name === 'li') {
          const defaultStyle = opts.textComponentProps ? opts.textComponentProps.style : null;
          const customStyle = inheritedStyle(parent);

          if (parent.name === 'ol') {
            listItemPrefix = (
              <TextComponent style={[defaultStyle, customStyle]}>
                {`${orderedListCounter++}. `}
              </TextComponent>
            );
          } else if (parent.name === 'ul') {
            listItemPrefix = (
              <TextComponent style={[defaultStyle, customStyle]}>{opts.bullet}</TextComponent>
            );
          }
        }

        if (node.name === 'br') {
          return <View style={{ width: '100%', height: 5 }} key={index} />;
        }

        const { NodeComponent, styles } = opts;

        return (
          <TouchableWithoutFeedback
            onPress={linkPressHandler}
            onLongPress={linkLongPressHandler}
            key={index}
          >
            <NodeComponent
              {...opts.nodeComponentProps}
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                maxWidth: width,
              }}
            >
              {listItemPrefix}
              {domToElement(node.children, node)}
            </NodeComponent>
          </TouchableWithoutFeedback>
        );
      }
    });
  }

  const handler = new htmlparser.DomHandler(function(err, dom) {
    if (err) done(err);
    done(null, domToElement(dom));
  });
  const parser = new htmlparser.Parser(handler);
  parser.write(rawHtml);
  parser.done();
}
