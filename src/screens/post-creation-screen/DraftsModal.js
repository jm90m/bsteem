import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';
import DraftsScreen from './DraftsScreen';

const DraftsModal = ({ handleHideDrafts, draftsVisible, handleSelectDraft }) => {
  if (!draftsVisible) {
    return null;
  }

  return (
    <Modal animationType="slide" visible={draftsVisible} onRequestClose={handleHideDrafts}>
      <SafeAreaView>
        <DraftsScreen handleHideDrafts={handleHideDrafts} handleSelectDraft={handleSelectDraft} />
      </SafeAreaView>
    </Modal>
  );
};

DraftsModal.propTypes = {
  handleHideDrafts: PropTypes.func.isRequired,
  draftsVisible: PropTypes.bool.isRequired,
  handleSelectDraft: PropTypes.func.isRequired,
};

export default DraftsModal;
