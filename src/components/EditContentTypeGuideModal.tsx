import React, { useState } from 'react';
import { Modal, TextInput, Button, FormLabel, Flex, Box } from '@contentful/f36-components';
import { ContentType } from '../@types';

type EditContentTypeGuideModalProps = {
  isOpen: boolean;
  contentType: ContentType;
  defaultGuideId: string;
  guideId: string;
  onClose: () => void;
  onSave: (contentType: ContentType, defaultGuideId: string, guideId: string) => void;
};

const EditContentTypeGuideModal = ({
  isOpen,
  onClose,
  contentType,
  defaultGuideId: initialDefaultGuideId,
  guideId: initialGuideId,
  onSave,
}: EditContentTypeGuideModalProps) => {
  const [defaultGuideId, setDefaultGuideId] = useState(initialDefaultGuideId);
  const [guideId, setGuideId] = useState(initialGuideId);

  const handleSave = () => {
    onSave(contentType, defaultGuideId, guideId);
    onClose();
  };

  return (
    <Modal isShown={isOpen} onClose={onClose} size="large" position="top">
      <Modal.Header title="Edit Content Type Guide" onClose={onClose} />
      <Modal.Content>
        <Flex gap="spacingXl">
          <Box>
            <FormLabel htmlFor="defaultGuideId">
              Default Guide ID
            </FormLabel>
            <TextInput
              isDisabled
              id="defaultGuideId"
              value={defaultGuideId || ''}
              onChange={(e) => setDefaultGuideId(e.target.value)}
            />
          </Box>
          <Box>
            <FormLabel htmlFor="guideId">Guide ID Override</FormLabel>
            <TextInput
              id="guideId"
              value={guideId || ''}
              onChange={(e) => setGuideId(e.target.value)}
            />
          </Box>
        </Flex>
      </Modal.Content>
      <Modal.Controls>
        <Button variant="positive" onClick={handleSave}>Save</Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Controls>
    </Modal>
  );
};

export default EditContentTypeGuideModal;