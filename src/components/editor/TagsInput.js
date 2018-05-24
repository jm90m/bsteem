import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';
import Tag from 'components/post/Tag';
import { FormInput, FormLabel, FormValidationMessage } from 'react-native-elements';
import { MATERIAL_ICONS, ICON_SIZES, COLORS } from 'constants/styles';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { connect } from 'react-redux';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import tinycolor from 'tinycolor2';

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

const Description = styled(StyledTextByBackground)`
  padding: 0px 20px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

class TagsInput extends Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string),
    tagsInput: PropTypes.string,
    onChangeTags: PropTypes.func,
    removeTag: PropTypes.func,
    tagError: PropTypes.string,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
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
    const { tags, tagsInput, onChangeTags, removeTag, customTheme, intl } = this.props;
    const inputTextColor = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;

    return (
      <Container>
        <FormLabel>{intl.topics}</FormLabel>
        <Description>{intl.topics_extra}</Description>
        <FormInput
          onChangeText={onChangeTags}
          placeholder={intl.topics_error_empty}
          value={tagsInput}
          autoCapitalize="none"
          maxLength={20}
          inputStyle={{ color: inputTextColor }}
          placeholderTextColor={inputTextColor}
        />
        {this.renderTagError()}
        <TagsContainer>
          {_.map(tags, tag => (
            <TagOption key={tag}>
              <Tag tag={tag} />
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <MaterialIcons
                  name={MATERIAL_ICONS.close}
                  size={ICON_SIZES.actionIcon}
                  color={inputTextColor}
                />
              </TouchableOpacity>
            </TagOption>
          ))}
        </TagsContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(TagsInput);
