import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';
import Tag from 'components/post/Tag';
import { FormInput, FormLabel, FormValidationMessage } from 'react-native-elements';
import { MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import i18n from 'i18n/i18n';

const Container = styled.View``;

const TagsContainer = styled.View`
  flex-direction: row;
  padding: 5px 20px;
  flex-wrap: wrap;
`;

const TagOption = styled.View`
  flex-direction: row;
  padding: 5px 0;
  margin-right: 10px;
`;

const Description = styled.Text`
  padding: 0px 20px;
`;

class TagsInput extends Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string),
    tagsInput: PropTypes.string,
    onChangeTags: PropTypes.func,
    removeTag: PropTypes.func,
    tagError: PropTypes.string,
  };

  static defaultProps = {
    tags: [],
    tagsInput: '',
    tagError: '',
    onChangeTags: () => {},
    removeTag: () => {},
  };

  renderTagError() {
    const { tagError } = this.props;

    if (!_.isEmpty(tagError)) {
      return <FormValidationMessage>{tagError}</FormValidationMessage>;
    }
    return null;
  }

  render() {
    const { tags, tagsInput, onChangeTags, removeTag } = this.props;
    return (
      <Container>
        <FormLabel>{i18n.editor.tags}</FormLabel>
        <Description>{i18n.editor.tagsDescription}</Description>
        <FormInput
          onChangeText={onChangeTags}
          placeholder="Please enter tags"
          value={tagsInput}
          autoCapitalize="none"
          maxLength={20}
        />
        {this.renderTagError()}
        <TagsContainer>
          {_.map(tags, tag => (
            <TagOption key={tag}>
              <Tag tag={tag} />
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <MaterialIcons name={MATERIAL_ICONS.close} size={ICON_SIZES.actionIcon} />
              </TouchableOpacity>
            </TagOption>
          ))}
        </TagsContainer>
      </Container>
    );
  }
}

export default TagsInput;
