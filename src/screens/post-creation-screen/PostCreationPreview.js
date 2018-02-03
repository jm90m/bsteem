import React from 'react-native';
import styled from 'styled-components/native';
import { Header } from 'react-native-elements';
import { COLORS } from 'constants/styles';

const Container = styled.View`
`;

class PostCreationPreview extends Component {
  render() {
    const styles = {
      borderBottomColor: COLORS.WHITE.GAINSBORO,
      borderBottomWidth: 2,
    };

    return (
      <Container>
        <Header
          centerComponent={{
            text: 'Post Preview',
            style: { color: COLORS.WHITE.WHITE, fontWeight: 'bold' },
          }}
          backgroundColor={COLORS.PRIMARY_COLOR}
          outerContainerStyles={styles}
        />
      </Container>
    );
  }
}

export default PostCreationPreview;
