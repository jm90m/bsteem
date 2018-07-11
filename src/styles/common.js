import { StyleSheet } from 'react-native';
import { FONTS } from 'constants/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postTitle: {
    fontSize: 20,
    margin: 5,
    fontFamily: FONTS.TITLE,
  },
  singlePostTitle: {
    fontSize: 20,
    fontFamily: FONTS.TITLE,
  },
  primaryText: {
    fontFamily: FONTS.PRIMARY,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  rowAlignedCenterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerValue: {
    marginRight: 16,
    marginLeft: 5,
    fontSize: 15,
    alignSelf: 'center',
    fontFamily: FONTS.PRIMARY,
  },
  backButton: {
    justifyContent: 'center',
    padding: 10,
  },
  scrollViewEndPadding: {
    paddingBottom: 200,
  },
  emptyView: {
    height: 200,
    width: 100,
  },
  headerMenuIconContainer: {
    padding: 5,
  },
  postSeeAllCommentsButtonStyle: {
    marginTop: 40,
  },
  screenLoader: {
    marginTop: 50,
  },
  postFooterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  menuModalContainer: {
    flexDirection: 'column-reverse',
    flex: 1,
    width: '100%',
  },
});

export default styles;
